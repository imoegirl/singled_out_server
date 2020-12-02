const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const redisopt = require('./db/redisopt');

const dbopt = require('./db/dbopt');
const { json } = require('body-parser');



function push_nicknames_to_redis(){
  let data = fs.readFileSync('./nickname.txt').toString();
  let names = data.split('\n');
  if (names[names.length - 1] == '') {
    names.pop();
  }

  console.log('nickname count: ', names.length);

  redisopt.push_unuse_names(names);
}

// 将测试数据 PUSH 到 Redis 中
// push_nicknames_to_redis();


// redisopt.get_one_unuse_name().then((result) => {
//   console.log('async result: ', result);
// });

// redisopt.update_score('11111', 101).then((result) => {
//   console.log('update score result: ', result);
// });

// redisopt.get_rank_and_max_score('11111').then((result) => {
//   console.log('rank: ', result.rank);
//   console.log('score: ', result.score);
// });


function handle_get_ranklist(req, res){

}

function handle_save_score(req, res) {

}


function handle_get_nickname(req, res) {
  // let resp = {'code': 0, 'nickname': '无名小可爱'};
  // res.send(JSON.stringify(resp));
  redisopt.get_one_unuse_name().then((result) => {
    let code = 0;
    if (result == null){
      code = -1;
    }

    let resp = {'code': code, 'nickname': result};
    console.log('分配昵称: ', result);
    
    res.send(JSON.stringify(resp));
  });
}


function handle_get_nickname_en(req, res) {
  // let resp = {'code': 0, 'nickname': '无名小可爱'};
  // res.send(JSON.stringify(resp));
  redisopt.get_one_unuse_name_en().then((result) => {
    let code = 0;
    if (result == null){
      code = -1;
    }

    let resp = {'code': code, 'nickname': result};
    console.log('分配昵称: ', result);
    
    res.send(JSON.stringify(resp));
  });
}


function handle_get_rank(req, res) {
  let guid = req.params.guid;
  // console.log('get rank guid: ', guid);
  redisopt.get_rank_and_max_score(guid).then((result) => {
    // console.log(result);
    console.log(guid, ' 获取排名: ', result);
    res.send(JSON.stringify(result));
  });
}

function handle_update_score(req, res) {
  let guid = req.params.guid;
  let score = req.params.score;

  // console.log('update score: ', guid, score);
  
  redisopt.update_score(guid, score).then((result) => {
    console.log(guid, ' 更新分数: ', score, ' Result:', result);
    res.send(JSON.stringify(result));
  });
}

function handle_get_ranklist(req, res) {
  let count = req.params.count;
  redisopt.get_ranklist(count).then((result) => {
    // console.log(result);
    let resp = {'code': 0, 'data': result};
    res.send(JSON.stringify(resp));
  });
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/get_nickname', handle_get_nickname);
app.get('/get_nickname_en', handle_get_nickname_en);
app.get('/get_rank/:guid', handle_get_rank);
app.get('/update_score/:guid/:score', handle_update_score);
app.get('/get_ranklist/:count', handle_get_ranklist);

// app.get('/get_ranklist/:guid', dbopt.get_ranklist);
// app.post('/save_score', dbopt.save_score);
// app.post('/create_user', dbopt.create_user);

app.listen(3001, () => {
  console.log('示例应用正在监听 3001 端口!');
});
