const config = require('config');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider(config.get('web3.rpc')));

module.exports = web3;