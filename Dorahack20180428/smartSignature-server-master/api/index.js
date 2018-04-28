const Promise = require('bluebird');
const axios = require('axios');
const config = require('config');
const sanitizeHtml = require('sanitize-html');
const ItemModel = require('../db/model/ItemModel');
const constractProxy = require('../contract');
const web3 = require('../web3');
const utils = require('../utils');

const createItem = async (created) => {
    const item = new ItemModel(created);
    const result = await item.save();
    return { result };
};

const getItem = async ({ contractAddress, tokenId, me }) => {
    tokenId = Number(tokenId);
    contractAddress = contractAddress.toLowerCase();

    const findInDB = ItemModel.findOne({ contract: contractAddress, tokenId }).exec();
    const findInContract = constractProxy(contractAddress).tokens(tokenId);
    const findSponsors = getSponsors({ contractAddress, tokenId });
    const findMyRemainAndTotal = !me ? null : constractProxy(contractAddress).totalAndRemainOf(tokenId, me);

    let itemInDB, itemInContract, sponsors, myRemainAndTotal;
    [itemInDB, itemInContract, sponsors, myRemainAndTotal] = await Promise.all(
        [findInDB, findInContract, findSponsors, findMyRemainAndTotal]);

    let item = {};
    if (itemInDB !== null) {
        item.name = itemInDB.name;
        item.sourceLink = itemInDB.sourceLink;

        if (itemInDB.content) {
            item.content = sanitizeHtml(itemInDB.content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['span', 'img', 'h1', 'h2']),
                allowedAttributes: {
                    '*': ['style', 'class'],
                    'img': ['src'],
                    'iframe': ['src', 'frameborder', 'allowfullscreen'],
                    'a': ['href', 'target']
                },
                transformTags: {
                    'a': (tagName, attribs) => {
                        attribs.target = '_blank';
                        return {
                            tagName,
                            attribs,
                        };
                    }
                },
            });
        }
    }
    if (itemInContract) {
        item.creator = {
            address: itemInContract[1],
            name: '玲珑邪僧1',
            bio: '公众号「万物情史」/研发工程师/Python/Js1',
            avatar: 'http://ww1.sinaimg.cn/large/006z6wKXgy1fqh5t88cpfj30b40b4abx.jpg',
        };
        item.value = utils.toETH(itemInContract[2]);
        item.ponzi = itemInContract[4].toNumber();
    }
    if (item.creator && item.creator.address === '0x') {
        item = null;
    } else {
        if (myRemainAndTotal) {
            item.me = {
                total: utils.toETH(myRemainAndTotal[0]), // 我的预期总收益
                remain: utils.toETH(myRemainAndTotal[1]),  // 未到账收益
                got: utils.toETH(myRemainAndTotal[0] - myRemainAndTotal[1]),  // 已到账收益
            };
        }
        item.tokenId = tokenId;
        // item.sponsors = sponsors;
        item.tipTimes = sponsors.length; // 赞赏总次数
    }

    return item;
};

const getContractAddressAndTokenIdByTx = async ({ tx }) => {
    const itemInDB = await ItemModel.findOne({ tx }).exec();
    if (itemInDB) {
        return {
            contractAddress: itemInDB.contract,
            tokenId: itemInDB.tokenId
        }
    }
};
// const updateItem = async (updated) => {
//     const item = await ItemModel.findOneAndUpdate({ id: updated.id }, updated, { upsert: true }).exec();
//     if (item === null) {
//         // Insert a new one
//     } else {
//         // Update a existed one
//     }
//     return true;
// };

// const deleteItem = async ({ id }) => {
//     const item = await ItemModel.remove({ id }).exec();
//     return true;
// };

const getNetInfo = async () => {
    return {
        web3: config.get('web3'),
    }
};

const getAllItems = async () => {
    const total = await Promise.promisify(mainContract.totalSupply)();
    const itemIds = Array.from(
        new Array(total.toNumber()),
        (val, index) => index
    );
    const items = await Promise.all(itemIds.map(id => getItem({ id: id })));
    return items;
};

const findItems = async (filter) => {
    const items = await ItemModel.find({
        tokenId: {
            $gt: -1
        },
        contract: /^0x.*/i
    }).exec();

    return items;
};

const getSponsors = async ({ contractAddress, tokenId }) => {
    const api = `${config.get('etherscan.api')}/api?module=logs&action=getLogs&fromBlock=379224&toBlock=latest&address=${contractAddress}&topic0=0x86935bcc26560e04e681ac095e03943499d0027a2849d6c2b81b5906075098f8&topic1=${utils.to64Hex(tokenId)}`;
    const res = await axios.get(api);

    const sponsors = res.data.result.map(v => ({
        tokenId: parseInt(v.topics[1], 16),
        value: utils.toETH(parseInt(v.data, 16)),
        sponsor: {
            address: utils.trimHex(v.topics[2]),
        },
        referrer: utils.trimHex(v.topics[3]),
        timeStamp: parseInt(v.timeStamp, 16) * 1000,
    }));

    return sponsors;
};

// 获取合约商店里的所有合约
const getContracts = async () => {
    const mockContract1 = {
        component: 'Sponsor005',
        name: '打赏（Sponsor）合约',
        bio: '用户可通过打赏时，需要支付一定数量ETH，大部分会通过智能合约转账给内容作者。同时，用户（分享者）也可分享链接给他人，别人通过该链接打赏后，原分享者也可获得收益。',
        address: '0x7e0ca9A3c1Bb74C7FD860453e5292b391866aa41', // 合约地址
        creator: { // 合约创建者
            address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
            name: '玲珑邪僧1',
            bio: '公众号「万物情史」/研发工程师/Python/Js1',
            avatar: 'http://ww1.sinaimg.cn/large/006z6wKXgy1fqh5t88cpfj30b40b4abx.jpg',
        },
        statistics: {
            numOfUse: 20, // 使用次数
            // 评分 等。。。
        },
    };
    const mockContract2 = {
        component: 'HotPotato',
        name: '拍卖（Hot Potato）合约',
        bio: 'Hot Potato类型的玩法非常简单，只需使用ETH点击购买即可。购买后的Token就属于此玩家。如果其他玩家想要购买的话，需要溢价。而作为持有者无权拒绝别人购买。',
        address: '222', // 合约地址
        creator: { // 合约创建者
            address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
            name: '玲珑邪僧1',
            bio: '公众号「万物情史」/研发工程师/Python/Js1',
            avatar: 'http://ww1.sinaimg.cn/large/006z6wKXgy1fqh5t88cpfj30b40b4abx.jpg',
        },
        statistics: {
            numOfUse: 20, // 使用次数
            // 评分 等。。。
        },
    };
    const mockContract3 = {
        component: 'Bet',
        name: '押注（Bet）合约',
        bio: '创建挑战（例如：竞猜德国能否获得今年世界被冠军），在竞猜期间内，用户可使用ETH进行押注。最终，获胜方依据自己的投注比例瓜分失败方的总押注ETH。',
        address: '333', // 合约地址
        creator: { // 合约创建者
            address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
            name: '玲珑邪僧1',
            bio: '公众号「万物情史」/研发工程师/Python/Js1',
            avatar: 'http://ww1.sinaimg.cn/large/006z6wKXgy1fqh5t88cpfj30b40b4abx.jpg',
        },
        statistics: {
            numOfUse: 20, // 使用次数
            // 评分 等。。。
        },
    };
    return [mockContract1, mockContract2, mockContract3];
};

const getRewards = async ({ address, id, to }) => {
    let api = `https://ropsten.etherscan.io/api?module=logs&action=getLogs&fromBlock=379224&toBlock=latest&address=${address}&topic0=0xaf3f2e7a6a59387ae5467ef9f6c157b528ace1e36a58d90890056c38b932ad51&topic1=${utils.to64Hex(id)}`;
    if (to) {
        api += `&topic2=${utils.to64Hex(to)}`;
    }
    const res = await axios.get(api);

    let totalValue = 0;

    const rewards = res.data.result.map((v) => {
        const value = parseInt(v.data, 16);
        totalValue += value;
        return {
            id: parseInt(v.topics[1], 16),
            value,
            to: {
                address: utils.trimHex(v.topics[2]),
            },
            from: {
                address: utils.trimHex(v.topics[3]),
            },
            timeStamp: parseInt(v.timeStamp, 16) * 1000,
        };
    });

    return {
        totalValue,
        rewards,
    };
};

const methodMap = Object.create(null);
Object.assign(methodMap, {
    getItem,
    createItem,
    findItems,
    getNetInfo,
    getSponsors,
    getContracts,
    getContractAddressAndTokenIdByTx
});

module.exports = ({ method, params }) => {
    const func = methodMap[method];
    if (typeof func === 'function') {
        return func(params);
    }
    throw Error('Not found method: ' + method);
}