import Web3 from 'web3';
import Promise from 'bluebird';
import axios from 'axios';
import * as config from '@/config';

const web3Provider = window.web3 ? window.web3.currentProvider : null;
export const web3 = web3Provider
  ? new Web3(web3Provider)
  : new Web3(new Web3.providers.HttpProvider(config.defaultNetwork.rpc));

web3.eth.defaultAccount = web3.eth.accounts[0];

const updateAccount = () => {
  setTimeout(() => {
    if (web3.eth.accounts[0] !== web3.eth.defaultAccount) {
      window.location.reload();
    } else {
      updateAccount();
    }
  }, 1000);
};
updateAccount();

const contractCache = {};

const getContract = async (address) => {
  let contract = contractCache[address];

  if (!contract) {
    const res = await axios.get(`http://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${address}`);
    const contractABI = JSON.parse(res.data.result);
    contract = web3.eth.contract(contractABI).at(address);
  }
  return contract;
};

export const constractProxy = address => new Proxy({}, {
  get: (target, key) =>
    async (...args) => {
      const contract = await getContract(address);
      const data = await Promise.promisify(contract[key])(...args);
      return data;
    },
});

export default web3;
