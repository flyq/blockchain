const config = require('config');
const Web3 = require('web3');
const Promise = require('bluebird');
const ItemModel = require('./db/model/ItemModel');

const web3 = new Web3(new Web3.providers.HttpProvider(config.get('web3.rpc')));

const getTokenInfoByTx = async (tx) => {
    const receipt = await Promise.promisify(web3.eth.getTransactionReceipt)(tx);

    if (receipt) {
        const creator = receipt.from.toLowerCase();
        const contract = receipt.to.toLowerCase();
        const tokenId = parseInt(receipt.logs[0].topics[1], 16);
        return {
            creator,
            contract,
            tokenId
        };
    }
    return null;
};

const getAllNoIdItems = async () => {
    const items = await ItemModel.find({
        tokenId: undefined,
        tx: /^0x/i
    }).exec();
    return items;
}

const updateOneItem = async (item) => {
    try {
        const { contract, tokenId } = await getTokenInfoByTx(item.tx);
        item.contract = contract;
        item.tokenId = tokenId;
        await ItemModel.findOneAndUpdate({ _id: item._id }, item, { upsert: false }).exec();
    } catch (e) {
        console.log('e', e);
    }
};

const updateTokenId = async () => {
    try {
        const items = await getAllNoIdItems();
        items.forEach((item) => {
            updateOneItem(item);
        });
    } finally {
        setTimeout(updateTokenId, 10 * 1000);
    }
};

updateTokenId();