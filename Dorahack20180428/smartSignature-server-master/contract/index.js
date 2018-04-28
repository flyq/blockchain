const config = require('config');
const axios = require('axios');
const Promise = require('bluebird');
const web3 = require('../web3');

const contractCache = {};

const getContract = async (address) => {
    let contract = contractCache[address];

    if (!contract) {
        const url = `${config.get('etherscan.api')}/api?module=contract&action=getabi&address=${address}`;
        const res = await axios.get(url);
        const contractABI = JSON.parse(res.data.result);
        contract = web3.eth.contract(contractABI).at(address);
        contractCache[address] = contract;
    }
    return contract;
};

const constractProxy = address => new Proxy({}, {
    get: (target, key) =>
        async (...args) => {
            const contract = await getContract(address);
            const data = await Promise.promisify(contract[key])(...args);
            return data;
        },
});

module.exports = constractProxy;