# -*- coding:utf-8 -*-

from sys import exit
from account import account_get

digital_currency = ["ACE","ACT","AELF","AMM","ARK","AST","AVT","BAT","BCD","BCH","BTC","BCX","BIFI","BNT","BTG","BTM","BT2","CMT","CTR","CVC","DASH","DAT","DGB","DGD","DNT","EDO","ELF","ENG","EOS","ETC","ETH","EVX","FUN","GAS","GNT","GNX","HSR","ICN","ICX","IOTA","ITC","KCASH","KNC","LINK","LRC","LTC","MANA","MCO","MDA","MTH","MTL","GNAS","NEO","NULS","OAX","OMG","PAY","PPT","PRO","QASH","QSP","QTUM","QVT","RCN","RDN","REQ","SALT","SAN","SBTC","SMT","SNGLS","SNM","SNT","STORJ","SUB","SWFTC","TNB","TNT","USDT","VEN","WAX","XMR","XRP","XLM","XUC","ZEC","ZRX"]

def themeworld_4():
    print "欢迎来到4号主题世界，这是一个关于代币的世界"
    
    print "这里有%d种代币，它们分别是" % len(digital_currency) , digital_currency

    print "\n你想要哪一种？"
    next = raw_input("> ")
    if next == "BTC":
	print "There are lots of BTC here."
        exit(0)
    elif next == "exit":
	exit(0)
    elif next == "account":
	account_get()
	themeworld_4()
    else:
    	print "There are no what you choose, select others."



