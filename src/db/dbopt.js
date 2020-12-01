// 导入 mongoose 模块
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
mongoose.Promise = Bluebird;

const ScoreSchema = require('../models/schema_score')
const UserSchema = require('../models/schema_user');
const NicknameSchema = require('../models/schema_nickname');

/*
// 设置默认 mongoose 连接
const mongoDB = 'mongodb://127.0.0.1/skyfox_astromouse';
mongoose.set('useCreateIndex', true) 
mongoose.connect(mongoDB);
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
// 取得默认连接
const db = mongoose.connection;

// 将连接与错误事件绑定（以获得连接错误的提示）
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));
db.on('open', function() {
    console.log('数据库打开成功');
} );
*/

function insert_nickname(name) {
    NicknameSchema.create({name: name, inuse: false}, function(err, instance){
        if(err){
            console.log('ERROR: insert nickname faild!:', name);
        }
        else{
            console.log('Success: ', name);
        }
    });
}

function set_nickname_inuse(name, callback) {
    NicknameSchema.updateOne({name: name}, {inuse: true}, function(err){
        if(err) {
            console.log('设置昵称为使用状态失败: \n', err);
        }else{
            console.log('昵称 %s 使用成功!', name);
        }
    });
}

function get_one_unuse_nickname(callback) {
        NicknameSchema.findOne({'inuse': false}, function(err, data){
        if(err){
            console.log('查找随机昵称出错: ', err);
            callback({'code': -1});
        }else{
            console.log('data: ', data);
            if (data != null){
                callback({'code': 0, 'name': data.name});
            }
            else{
                callback({'code': -1});
            }
        }
    });
}

async function get_unuse_nickname(count, callback) {
    let docs = await NicknameSchema.find({'inuse': false}).limit(count);
    callback(docs);
}

function is_db_ready() {
    //console.log('State: ', db.readyState);
    return db.readyState == 1;
}


// function get_random_unuse_nickname(callback) {
//     NicknameSchema.findOne({'inuse': false}, function(err, data){
//         if(err){
//             console.log('查找随机昵称出错: ', err);
//         }else{
//             console.log('data: ', data);
//             if (data != null){
//                 data.inuse = true;
//                 data.save(function(err){
//                     if(err){
//                         console.log('昵称设置为使用失败: ', data.name);
//                     }
//                     else{
//                         console.log('Nickname: ', data.name);
//                     }
//                 });
//             }
//         }
//     });
// }


function find_user(guid, callback) {
    UserSchema.findOne({'guid': guid},function(err, data) {
        if (err) {
            callback({'code': -1});
        }else{
            console.log('data: ', data);
            callback({'code': 0, 'data': data});
        }
    });
}


function create_user(req, res) {
    let guid = req.body.guid;
    let name = req.body.name;

    let dataInvalid = false;

    if (guid === undefined || guid === null || guid.trim() == '') {
        console.log('GUID invalid');
        dataInvalid = true;
    } 

    if(name === undefined || name === null || name.trim() == '') {
        console.log('Name invalid');
        dataInvalid = true;
    }

    find_user(guid)

    if (dataInvalid) {
        res.send('data invalid');
    }

    res.send('create user un implement');
}


// {
//     "guid":999999,
//     "name":"fredshao",
//     "score":153
// }

function save_score(req, res) {
    let now = new Date();
    now.setHours(now.getHours() + 8);

    let new_score = new ScoreSchema ({
        guid: req.body.guid,
        name: req.body.name,
        score: req.body.score,
        date: now,
    });

    new_score.save(function(err) {
        if(err) {
            let resp = {'code': -1}
            res.send(JSON.stringify(resp));
        }else{
            let resp = {'code': 0, 'rank': 12}
            res.send(JSON.stringify(resp));
        }
    });

    // console.log('post 请求: ', req.body, req.body.guid, req.body.score, req.body.name);
    // res.send('未实现 save_score');
}

function get_ranklist(req, res) {
    let data = {
      "myScore: ": 97876,
      "myRank": 5,
      "top100": [
          {"guid": 111, "score": 87676, "rank": 1},
          {"guid": 222, "score": 76542, "rank": 2},
          {"guid": 333, "score": 54564, "rank": 3},
      ]  
    };

    let jsonData = JSON.stringify(data);

    res.send(jsonData);
}

module.exports = {
    is_db_ready: is_db_ready,
    save_score: save_score,
    get_ranklist: get_ranklist,
    create_user: create_user,
    insert_nickname: insert_nickname,
    get_one_unuse_nickname: get_one_unuse_nickname,
    get_unuse_nickname: get_unuse_nickname,
    set_nickname_inuse: set_nickname_inuse,
}