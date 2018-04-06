# -*- coding:utf-8 -*-

from account import account_get
from sys import exit
from themeworld_1 import themeworld_1
from util import *
from themeworld_4.themeworld_4 import themeworld_4

def themeworld():
    print "通过输入 details 查看不同传送门和主题世界的介绍。\n"
    next = raw_input("> ")
    if next == "details":
	themeworld_amount();
	themeworld_how_to_enter();
    elif next == "exit":
        exit(0);
    elif next == "account":
	account_get()
	themeworld()
    else:
        print "輸入錯誤，請根據提示輸入。"
        themeworld()



def is_int(s):
    try:
        int(s)
        return True
    except ValueError:
        pass
    return False
        

def themeworld_amount():
    amount = 2 # 可以把amount改为导入的模组数
    print "这里有%d个主题世界。1 and 4" % amount

def themeworld_how_to_enter():
    print "通过输入n，可以进入n号传送门并带你进入n号主题世界。"
    next = raw_input("> ")
    
    if is_int(next):
        if next == "1":
            themeworld_1()
        elif next == "4":
            themeworld_4()            
        else:
            print "%s号主题世界正在建设中，敬请期待..." % next
            themeworld_how_to_enter()
    else:
            print "输入有误，请输入正整数"
            themeworld_how_to_enter()
