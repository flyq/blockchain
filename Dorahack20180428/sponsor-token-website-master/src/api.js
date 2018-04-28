import Promise from 'bluebird';
import Cookie from 'js-cookie';
import axios from 'axios';
import web3 from './web3.js';
import * as config from '@/config';
import sponsorTokenABI from './abi/sponsorToken.json';

// Sometimes, web3.version.network might be undefined,
// as a workaround, use defaultNetwork in that case.
const network = config.network[web3.version.network] || config.defaultNetwork;
const sponsorTokenContract = web3.eth.contract(sponsorTokenABI).at(network.contract);
export const apiUrl = network.apiUrl;

export const callServerRpc = async (method, params) => {
  const response = await axios.post(`${apiUrl}/rpc`, {
    method,
    params,
  });
  return response.data.data;
};

export const getMe = async () => {
  if (!window.web3) {
    throw Error('NO_METAMASK');
  }
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((error, accounts) => {
      const address = accounts[0];
      if (address) {
        return resolve({ address });
      }
      return reject(new Error('METAMASK_LOCKED'));
    });
  });
};

export const saveImage = async (file) => {
  const param = new FormData();
  param.append('file', file, file.name);
  const response = await axios.post(`${apiUrl}/file`, param, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.file;
};

export const buyItem = (id, price) => new Promise((resolve, reject) => {
  sponsorTokenContract.buy(id, {
    value: price, // web3.toWei(Number(price), 'ether'),
    gas: 220000,
    gasPrice: 1000000000 * 100,
  },
  (err, result) => (err ? reject(err) : resolve(result)));
});

export const getTotal = () => Promise.promisify(sponsorTokenContract.totalSupply)();

export const getItemIds = async (offset, limit) => {
  const ids = await Promise.promisify(sponsorTokenContract.itemsForSaleLimit)(offset, limit);
  return ids.sort((a, b) => a - b);
};

export const getNetwork = async () => {
  const netId = await Promise.promisify(web3.version.getNetwork)();
  return config.network[netId];
};

export const createToken = async ({ price, frozen1, frozen2, parentId }) =>
  new Promise((resolve, reject) => {
    sponsorTokenContract.issueToken(web3.toWei(Number(price), 'ether'), frozen1, frozen2, parentId, {
      // value: price, // web3.toWei(Number(price), 'ether'),
      gas: 220000,
      gasPrice: 1000000000 * 100,
    },
    (err, result) => (err ? reject(err) : resolve(result)));
  });

export const getLocale = async () => (
  Cookie.get('locale') ||
  (
    navigator.language ||
    navigator.browserLanguage ||
    navigator.userLanguage
  ).toLowerCase()
);

export const setLocale = async (locale) => {
  Cookie.set('locale', locale, { expires: 365 });
};
