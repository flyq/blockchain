# -*- coding:utf-8 -*-

from sys import exit
from account import account_get

handbag_brand = ['Hermes', 'delvaux', 'goyard', 'LV', 'chanel', 'Dior', 'GUCCI', 'Prada']

handbag_1 = ['Hermes', 'kelly', 'blue']

def themeworld_1():
    print "欢迎来到1号主题世界，这是一个关于名牌包包的世界"
    
    print "這裏有%d種品牌的包包，分別是：" % len(handbag_brand) , handbag_brand

    print "\n你想要哪一種？"
    next = raw_input("> ")
    if next == "Hermes":
	print "There is only one style Hermes",handbag_1
    elif next == "exit":
	exit(0)
    elif next == "account":
	account_get()
	themeworld_1()
    else:
    	print "There are no what you choose, select others."



