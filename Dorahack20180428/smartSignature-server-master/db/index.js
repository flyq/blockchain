const config = require('config');
const mongoose = require('mongoose');
const logger = require('../logger');

mongoose.connect(config.get('mongodb.uri'), {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
});

const db = mongoose.connection;
db.on('error', (err) => {
    logger.fatal('Failed to connect with mongodb', err);
});
db.once('open', () => {
    logger.debug('Connected with mongodb');
});