4：
DORA: 0xbAaf27aEdFB5c70bfA48c2C05EcA8621fF410E16
https://ropsten.etherscan.io/address/0xd284f27ccb16a7ecf11c82d5479c699784bb99b0


1：
HACK：0xbd70d89667A3E1bD341AC235259c5f2dDE8172A9
https://ropsten.etherscan.io/address/0x7acbdd94f83774e2a90da0fedd874240352dbc25


2
THON：0x2994df20e6a7B759483ef9Ac205147F026D458De
https://ropsten.etherscan.io/address/0x710b72fbe94fda68d34b2b47693b9920f7f14a85


5
ERC20exchange1
0x104128567409738e19B760299afa94cfD846d312
https://ropsten.etherscan.io/address/0x65d52a832704f7dad8fe082b19af19269fde9eae



account4:
put1(d284, 1, 10);
getOrder(0)= owner:account, price:1; amount:10


account1:
exchange()

出错，debug发现参数类型设置错误







改了后再次部署：
5
ERC20exchange2

account4:
put1(d284, 1, 10);
getOrder(0)= owner:account, price:1; amount:10


account1:
exchange()



还是有错
发现不是exchange合约问题
是msg.sender理解错了

再次部署
Account5
https://ropsten.etherscan.io/address/0xf56afd2fa44b6d0935d0947d6be0b07764983187

1.
account4:
put1(d284, 1, 10);
getOrder(0)= owner:account, price:1; amount:10

2.
account4去d284合约执行approve函数，approve这个ERC20exchange合约这么多的token

3.
Account1去7acb合约执行approve函数，approve这个ERC20exchange合约这么多的token
4.account1去ERC20exchange合约执行exchange函数。成功！
account1:
exchange()
成功！
 
https://gist.github.com/flyq/9f4895033d965491979856ec3e95e8ff




再次部署，加入buy函数，所以，现在支持我发erc20 token，你买它可以用eth买部分，用其他某种erc20token买这个。
https://gist.github.com/flyq/8bd7d1c454268be0db673427f84457a0
account5：
https://ropsten.etherscan.io/address/0xc7972838af9468b264f509f903eb2b16796a7838

1.
account4去d284合约执行approve函数，approve这个ERC20exchange合约这么多的token


2.
account4:
put1(d284, 1, 10);
getOrder(0)= owner:account, price:1; amount:10

3.
Account1去7acb合约执行approve函数，approve这个ERC20exchange合约这么多的token

4.
Accountt1去ERC20exchange合约执行buy函数。Buy 1个
 
成功！

4.account1去ERC20exchange合约执行exchange函数。成功！
account1:
exchange()







再次部署
https://gist.github.com/flyq/8bd7d1c454268be0db673427f84457a0/revisions
修改边界条件，增加鲁棒性！
懒得部署了。




2、和线上ERC721
直接用岛娘的，把那个cut off删除了
https://gist.github.com/lychees/18824452caec6df9c68143a5474cccbc

account4：
水浒合约
https://ropsten.etherscan.io/address/0x4d047cb060a99ab699659b852704998596e10b90#code


account1：
萌王合约：
https://ropsten.etherscan.io/address/0x7db13f8e310f3f540c9a623060d40d7e925872c7


account5
去中心化erc721交易所
https://ropsten.etherscan.io/address/0xc4d8b03605432a53aaf3a3fc8f7d1e5dcea41b47#code




account3，
去中心化erc721交易所+confirm函数；







