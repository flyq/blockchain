const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    tokenId: Number,
    contract: String,
    tx: { type: String, unique: true },
    name: String,
    content: String,
    sourceLink: String,
});

const ItemModel = mongoose.model('Item', itemSchema);

module.exports = ItemModel;