/* eslint-disable import/prefer-default-export */

export const network = {
  1: {
    name: 'Main Ethereum Network',
    contract: '',
    rpc: 'https://mainnet.infura.io/lTETGFVyQX99UKQ98BN4',
    apiUrl: 'http://35.194.220.56',
  },
  2: {
    name: 'Morden Test Network',
    contract: '',
  },
  3: {
    default: true, // It will be used when no metaMask
    name: 'Ropsten Test Network',
    contract: 'true',
    rpc: 'https://ropsten.infura.io/lTETGFVyQX99UKQ98BN4',
    apiUrl: 'http://35.194.220.56',
    // apiUrl: 'http://localhost:1234',
  },
  4: {
    name: 'Rinkeby Test Network',
    contract: '',
    rpc: 'https://rinkeby.infura.io/lTETGFVyQX99UKQ98BN4',
    apiUrl: '',
  },
  42: {
    name: 'Kovan Test Network',
    contract: '',
    rpc: 'https://kovan.infura.io/lTETGFVyQX99UKQ98BN4',
    apiUrl: '',
  },
};

export const defaultNetwork = Object.values(network).find(net => net.default);

export const i18n = [
  {
    langDisplay: '中文',
    locale: 'zh',
    aliases: ['zh', 'zh-cn', 'zh-hk', 'zh-sg', 'zh-tw'],
  },
  {
    langDisplay: 'English',
    locale: 'en',
    aliases: ['en', 'en-us', 'en-au', 'en-bz', 'en-ca', 'en-ie', 'en-jm', 'en-nz', 'en-ph', 'en-za', 'en-tt', 'en-gb', 'en-zw'],
  },
  {
    langDisplay: '日本語',
    locale: 'jp',
    aliases: ['jp'],
  },
];

