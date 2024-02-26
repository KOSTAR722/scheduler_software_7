const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql=require('mysql2');
const app = express();
const fs=require('fs');
const request=require('request');

const { JSDOM } = require("jsdom");
const { window } = new JSDOM('<html><body><div id="aaa">AAA<div></body></html>');
const $ = require("jquery")(window);
count=-9999;

fs.readFile('./public/html/calendar.html','utf-8',function(err,data){
  console.log(data+'test.htmlの内容');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));




const connection = mysql.createConnection({
    host: 'esdb.cis.iwate-u.local',
    user: 'user2023gr07',
    password: '23gr07.ZFbe',
    database: 'db2023gr07'
  });
  

connection.connect((err) => {
  if (err) {
    console.error('データベースへの接続エラー:', err);
    return;
  }

  console.log('データベースに接続しました');
});

app.get('/', (req, res) => {
    
    res.sendFile(__dirname+'/public/html/test.html');

});

app.listen(8000, '192.168.0.3',() => {
    console.log('Start server port:8000');
});


