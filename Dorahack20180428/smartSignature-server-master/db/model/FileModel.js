const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    uuid: String,
    data: Buffer,
    size: Number,
    rawName: String,
    contentType: String,
});

const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;