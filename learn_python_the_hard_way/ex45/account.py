# -*- coding:utf-8 -*-

from sys import exit

def account():
    print "请问你是否有账户？y or n"
    next = raw_input("> ")
    if next == "y":
        account_login()
    elif next == "n":
	account_setup()
    elif next == "exit":
	exit(0)
    else:
	print "输入错误，请按照提示来。"
	account()	

def account_login():
    print "请输入你的帐号："
    next = raw_input("> ")
    if next == "flyq":
	print "請輸入你的密碼"
	next1 = raw_input("> ")
	if next1 == "52kaiyuan":
	    print "恭喜你已經登錄，祝你在不同主題世界玩得快樂。"
	elif next1 == "exit":
	    exit(0)
	else:
	    print "輸入錯誤，請按照提示重新輸入。"
	    account_login()
    elif next == "exit":
	exit(0)
    else:
	print "输入错误。"
	account_login()
    
def account_setup():
    print "setting up now...\n"
    print "你的帐号已经注册好了"
    account_login()
    

def account_get():
    print "Your account is: %s\nYour balance is %d." % ("flyq", 1000)
