const fs = require('fs');
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const log4js = require('log4js');
const helmet = require('helmet');
const cors = require('cors');
const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');
const api = require('./api');
const logger = require('./logger');
require('./job');
require('./db');

const app = express();

app.use(cors({
    origin: [/https?:\/\/(www\.)?smartsignature\.io$/i, /https?:\/\/localhost(:\d+)?$/i]
}));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async(req, res) => {
    res.json({ data: "Hi" });
});

// health check
app.get('/healthz', (req, res) => {
    res.json({
        mongoState: mongoose.connection.readyState,
        uptime: process.uptime(),
        now: new Date().getTime(),
        env: config.util.getEnv('NODE_ENV')
    });
});

const FileModel = require('./db/model/FileModel');

app.post('/file', (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, rawFiles) => {
        if (err) return next(err);
        const uuidMap = {};
        const files = Object.keys(rawFiles).map((key) => {
            const rawFile = rawFiles[key];
            const uuid = uuidv4();
            const file = new FileModel({
                rawName: rawFile.name,
                size: rawFile.size,
                contentType: rawFile.type,
                data: fs.readFileSync(rawFile.path),
                uuid,
            });
            uuidMap[key] = { id: uuid, url: config.get('cdnUrl') + uuid };
            return file;
        });
        const savingFiles = files.map((file) => { return file.save(); });
        const savedFiles = await Promise.all(savingFiles);
        return res.json(uuidMap);
    });
});

app.get('/file/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    const file = await FileModel.findOne({ uuid }).exec();
    res.set('Content-Type', file.contentType);
    res.end(file.data);
});

app.post('/rpc', async (req, res) => {
    const payload = req.body || {};
    const result = {
        data: null,
        err: null
    };
    try {
        logger.debug(`Calling api\n`, payload);
        result.data = await api(payload);
        logger.debug('Result from api\n', { payload, data: result.data });
    } catch (e) {
        const err = { code: '' };
        if (config.get('api.showFullErr')) {
            err.message = e.message;
            err.detail = { payload, e };
        }
        logger.error('Failed to call api\n', { payload, err });
        result.err = err;
    }
    res.json(result);
});

const port = config.get('port') || process.env.PORT || 80;
app.listen(port, () => logger.debug('Listening on port ' + port));
