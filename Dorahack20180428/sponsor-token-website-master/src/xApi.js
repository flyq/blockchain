import axios from 'axios';
import emitter from '@/emitter';
import * as config from '@/config';
import { web3, constractProxy } from './web3';

const network = config.network[web3.version.network] || config.defaultNetwork;
const apiUrl = network.apiUrl;

const apiMap = Object.create(null);

const callServerRpc = async (method, params) => {
  let res;
  try {
    res = await axios.post(`${apiUrl}/rpc`, {
      method,
      params,
    });
  } catch (e) {
    e.code = 'REQUEST_FAIL';
    throw e;
  }
  return res.data.data;
};

apiMap.login = async () => {
  let err;
  if (!window.web3) {
    err = Error('没有安装MetaMask插件');
    err.code = 'NO_METAMASK';
    throw err;
  }
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((error, accounts) => {
      const address = accounts[0];
      if (address) {
        return resolve({ address });
      }
      err = Error('请解锁MetaMask插件');
      err.code = 'METAMASK_LOCKED';
      return reject(err);
    });
  });
};

apiMap.getItem = async ({ tokenId, contractAddress, tx }) => {
  let me = {};

  try {
    me = await apiMap.login();
  } catch (e) {}
  const item = await callServerRpc('getItem', { tokenId, contractAddress, me: me.address, tx });
  if (item === null) {
    const err = Error('签名不存在');
    err.code = 'ITEM_NOT_EXIST';
    throw err;
  }
  return item;
};

// 获取合约商店里的所有合约
apiMap.getContracts = async () => {
  const contracts = await callServerRpc('getContracts');
  return contracts;
};

// 对item进行打赏，referrer: 推荐人，value: 打赏金额
apiMap.tipToken = async ({ contract, id, value, referrer }) => {
  await apiMap.login();

  try {
    const tx = await constractProxy(contract).sponsor(Number(id), referrer, {
      value: web3.toWei(Number(value), 'ether'),
      gas: 220000,
      gasPrice: 1000000000 * 100,
    });
    return tx;
  } catch (e) {
    if (e.message && e.message.startsWith('Error: MetaMask Tx Signature: User denied transaction signature.')) {
      e.message = '支付被取消';
      e.code = 'METAMASK_DENY_TX_SIGN';
    } else {
      e.code = 'METAMSK_FAIL';
    }
    throw e;
  }
};

apiMap.createItem = async ({ contractAddress, item }) => {
  await apiMap.login();

  const tx = await constractProxy(contractAddress).create(item.ponzi, {
    // value: web3.toWei(Number(value), 'ether'),
    gas: 220000,
    gasPrice: 1000000000 * 100,
  });
  await callServerRpc('createItem', {
    tx,
    contract: contractAddress,
    name: item.name,
    sourceLink: item.sourceLink,
    content: item.content,
  });
  return tx;
};

apiMap.getContractAddressAndTokenIdByTx = async ({ tx }) => {
  const { contractAddress, tokenId } = await callServerRpc('getContractAddressAndTokenIdByTx', { tx });
  return { contractAddress, tokenId };
};

const defaultOptions = {
  activityIndicator: {
    isShow: true,
    text: '',
  },
  showErrorAlert: true,
  redirectToLogin: true,
};

export default async (name, params, options = defaultOptions) => {
  const func = apiMap[name];
  let data;
  let error;

  if (typeof func === 'function') {
    if (options.activityIndicator) {
      emitter.emit('TOGGLE_ACTIVITY_INDICATOR', true);
    }
    try {
      data = await func(params);
    } catch (e) {
      error = e;
    }
    if (options.activityIndicator) {
      emitter.emit('TOGGLE_ACTIVITY_INDICATOR', false);
    }
    if (data) return data;
  } else {
    error = { code: 'INVALID_API_NAME', message: 'API不存在' };
  }
  if (options.redirectToLogin && error.code === 'UNAUTHORIZED') {
    // TODO: redirect to login
    return { error };
  }
  if (options.showErrorAlert) {
    emitter.emit('ALERT_ERROR', error);
  }
  return { error };
};
