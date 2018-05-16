var express = require('express');
var router = express.Router();

/**
 * 这几行会告诉app我们需要连接MongoDB，我们用Monk来负责这个连接，我们数据库位置是localhost:27017/nodetest1。注意27017是mongodb的默认端口，如果因为某些原因你修改了端口，记录这里也要跟着改。
 */
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/hacktest');

/* GET userlist page. */
router.get('/', function (req, res, next) {
    var collection = db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.render('userlist', {"userlist": docs});
    });
});

module.exports = router;
