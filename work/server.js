const fs=require('fs');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql=require('mysql2');
const app = express();
const { JSDOM } = require("jsdom");
const { error, count } = require('console');
const { resourceUsage } = require('process');
const { type } = require('os');

//日付判定用配列
const week=["sun","mon","tue","wed","thu","fri","sat"];
const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 60000000000 },
  resave: false,
  saveUninitialized: false,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(sess));
app.use(express.static('public'));


const connection = mysql.createConnection({
  host: '******************',
  user: '************',
  password: '**********',
  database: 'db2023gr07'
});


connection.connect((err) => {
  if (err) {
    console.error('データベースへの接続エラー:', err);
    return;
  }

  console.log('データベースに接続しました');
});

  //ルーティング設定
  
  app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/html/login.html');
})
app.get('/login.html', (req, res) => {
  
  res.sendFile(__dirname+'/public/html/login.html');
});



app.get('/calendar.html', (req, res) => {
  if (check_session(req.session.name)) {
    res.redirect('/login.html');
  }
  else{

    //JQUERYでHTML書き換え
    fs.readFile(__dirname+'/public/html/calendar.html','utf-8',function(err,data){
      let str_html=["","","","","","",""];
      let str_css=["","","","","","",""];
      let str_html_job=["","","","","","","",""];
      let str_css_job=["","","","","","","",""];
      let str_day=new Array(13);
      const { window } = new JSDOM(data);
      const $ = require("jquery")(window);
      $("#name").html(req.session.name+"様ようこそ");
      str_day=today_week();
      $("h1#yearmonth").html(str_day[10]);
      for(let i=0;i<7;i++){
        $("td#"+week[i]).html(str_day[i]);
      }
      $("input#tran_1").attr("value",str_day[7]);
      $("input#tran_2").attr("value",str_day[8]);
      $("input#tran_3").attr("value",str_day[9]);
      connection.query(
        'select id from user where name="'+req.session.name+'";',
        (error, results) => {


          //授業予定表示機能
          connection.query(
            "select def_set.id,schedule_class.name,schedule_class.date,schedule_class.period,schedule_class.class_time,case schedule_class.period when 1 then hour(def_set.class1) when 2 then hour(def_set.class2) when 3 then hour(def_set.class3) when 4 then hour(def_set.class4) when 5 then hour(def_set.class5) when 6 then hour(def_set.class6) end,case schedule_class.period when 1 then minute(def_set.class1) when 2 then minute(def_set.class2) when 3 then minute(def_set.class3) when 4 then minute(def_set.class4) when 5 then minute(def_set.class5) when 6 then minute(def_set.class6) end from schedule_class,def_set where schedule_class.id=def_set.id and def_set.id="+results[0]["id"]+";",
            (error, results) => {
              console.log("講義予定表示に成功しました");

              for(let i=0;i<results.length;i++){
                if(typeof results[i]["name"]!=="undefined"){
                  // 予定があったときjqueryでhtmlを書き換え
                  var total_minutes=60*results[i]['case schedule_class.period when 1 then hour(def_set.class1) when 2 then hour(def_set.class2) when 3 then hour(def_set.class3) when 4 then hour(def_set.class4) when 5 then hour(def_set.class5) when 6 then hour(def_set.class6) end']+results[i]['case schedule_class.period when 1 then minute(def_set.class1) when 2 then minute(def_set.class2) when 3 then minute(def_set.class3) when 4 then minute(def_set.class4) when 5 then minute(def_set.class5) when 6 then minute(def_set.class6) end '];
                  let con_top=total_minutes*0.8666;//中身の開始位置
                  let con_height=results[i]["class_time"]*0.8666;//中身の縦幅
                  // console.log("td.box_"+(results[i]["date"]));
                  str_html[results[i]["date"]]+="<div class=addition id='box"+results[i]["date"]+"_"+i+"'>"+results[i]["name"]+"</div>";

                  // console.log("#box"+results[i]["date"]+"_"+i+"{width:95%; height:"+con_height+"px; border: 1px solid gray; position:absolute; top:"+con_top+"px;}");
                  str_css[results[i]["date"]]+="#box"+results[i]["date"]+"_"+i+"{height:"+con_height+"px;position:absolute; top:"+con_top+"px;}";
                  
                  // console.log("box"+results[i]["date"]+"_"+i); 

                }
              }
            }
          );


          //バイト予定表示機能
          console.log('select hour(start),minute(start),dayofweek(start),hour(timediff(end,start)),minute(timediff(end,start)),name from schedule_job where id='+results[0]["id"]+' and start>="'+str_day[7]+'-'+str_day[12]+'-'+str_day[0]+' 00:00:00" and end<="'+str_day[7]+'-'+str_day[11]+'-'+str_day[6]+' 00:00:00";');
              connection.query(
                'select hour(start),minute(start),dayofweek(start),hour(timediff(end,start)),minute(timediff(end,start)),name from schedule_job where id='+results[0]["id"]+' and start>="'+str_day[7]+'-'+str_day[12]+'-'+str_day[0]+' 00:00:00" and end<="'+str_day[7]+'-'+str_day[11]+'-'+str_day[6]+' 23:59:59";',
                (error,results)=>{
                  if(results[0]!=null){
                  for(let i=0;i<results.length;i++){
                    if(typeof results[i]["hour(start)"]!=="undefined"){
                      // バイトがあったときjqueryでhtmlを書き換え
                      var total_minutes=60*results[i]["hour(start)"]+results[i]["minute(start)"];
                      let con_top=total_minutes*0.8666;//中身の開始位置
                      let con_height=results[i]["hour(timediff(end,start))"]*60*0.8666+results[i]["minute(timediff(end,start))"];//中身の縦幅
                      console.log(results[i]);
                      str_html_job[results[i]["dayofweek(start)"]-1]+="<div class=addition_job id='box"+(results[i]["dayofweek(start)"]-1)+"_"+i+"_job'>"+results[i]["name"]+"</div>";
                      str_css_job[results[i]["dayofweek(start)"]-1]+="#box"+(results[i]["dayofweek(start)"]-1)+"_"+i+"_job"+"{height:"+con_height+"px;position:absolute; top:"+con_top+"px;}";
                    }
                  }
                  }
                  for(let j=0;j<7;j++){
                    $("td.con_"+j).html(str_html[j]+str_html_job[j]+"<style>"+str_css[j]+str_css_job[j]+"</style>");
                  }
                  text=$('html').html();
                  res.send(text);
                }
                
              );

              
        }          
    )
         
    });
  console.log(req.session.name+"がcalendarにアクセスしました");
  }
  
});

//１週進んで表示
app.get('/calendar_next',(req,res)=>{
  console.log(req.query.date);
  if (check_session(req.session.name)) {
    res.redirect('/login.html');
  }
  else{

    //JQUERYでHTML書き換え
    fs.readFile(__dirname+'/public/html/calendar.html','utf-8',function(err,data){
      let str_html=["","","","","","",""];
      let str_css=["","","","","","",""];
      let str_html_job=["","","","","","",""];
      let str_css_job=["","","","","","",""];
      let str_day=new Array(13);
      const { window } = new JSDOM(data);
      const $ = require("jquery")(window);
      $("#name").html(req.session.name+"様ようこそ");
      
      str_day=nextmonth(Number(req.query.year),Number(req.query.month),Number(req.query.date));
      console.log(str_day);
      $("h1#yearmonth").html(str_day[10]);
      for(let i=0;i<7;i++){
        $("td#"+week[i]).html(str_day[i]);
      }
      $("input#tran_1").attr("value",str_day[7]);
      $("input#tran_2").attr("value",str_day[8]);
      $("input#tran_3").attr("value",str_day[9]);
      connection.query(
        'select id from user where name="'+req.session.name+'";',
        (error, results) => {


          //授業予定表示機能
          connection.query(
            "select def_set.id,schedule_class.name,schedule_class.date,schedule_class.period,schedule_class.class_time,case schedule_class.period when 1 then hour(def_set.class1) when 2 then hour(def_set.class2) when 3 then hour(def_set.class3) when 4 then hour(def_set.class4) when 5 then hour(def_set.class5) when 6 then hour(def_set.class6) end,case schedule_class.period when 1 then minute(def_set.class1) when 2 then minute(def_set.class2) when 3 then minute(def_set.class3) when 4 then minute(def_set.class4) when 5 then minute(def_set.class5) when 6 then minute(def_set.class6) end from schedule_class,def_set where schedule_class.id=def_set.id and def_set.id="+results[0]["id"]+";",
            (error, results) => {
              console.log("講義予定表示に成功しました");
              if(results[0]!=null){

              for(let i=0;i<results.length;i++){
                  // 予定があったときjqueryでhtmlを書き換え
                  var total_minutes=60*results[i]['case schedule_class.period when 1 then hour(def_set.class1) when 2 then hour(def_set.class2) when 3 then hour(def_set.class3) when 4 then hour(def_set.class4) when 5 then hour(def_set.class5) when 6 then hour(def_set.class6) end']+results[i]['case schedule_class.period when 1 then minute(def_set.class1) when 2 then minute(def_set.class2) when 3 then minute(def_set.class3) when 4 then minute(def_set.class4) when 5 then minute(def_set.class5) when 6 then minute(def_set.class6) end '];
                  let con_top=total_minutes*0.8666;//中身の開始位置
                  let con_height=results[i]["class_time"]*0.8666;//中身の縦幅
                  // console.log("td.box_"+(results[i]["date"]));
                  str_html[results[i]["date"]]+="<div class=addition id='box"+results[i]["date"]+"_"+i+"'>"+results[i]["name"]+"</div>";

                  // console.log("#box"+results[i]["date"]+"_"+i+"{width:95%; height:"+con_height+"px; border: 1px solid gray; position:absolute; top:"+con_top+"px;}");
                  str_css[results[i]["date"]]+="#box"+results[i]["date"]+"_"+i+"{height:"+con_height+"px;position:absolute; top:"+con_top+"px;}";
                  
                  // console.log("box"+results[i]["date"]+"_"+i); 
              }
            }
            }
          );


          //バイト予定表示機能
              connection.query(
                'select hour(start),minute(start),dayofweek(start),hour(timediff(end,start)),minute(timediff(end,start)),name from schedule_job where id='+results[0]["id"]+' and start>="'+str_day[7]+'-'+str_day[12]+'-'+str_day[0]+' 00:00:00" and end<="'+str_day[7]+'-'+str_day[11]+'-'+str_day[6]+' 23:59:59";',
                (error,results)=>{
                  if(results[0]!=null){
                  for(let i=0;i<results.length;i++){
                      // バイトがあったときjqueryでhtmlを書き換え
                      if(typeof results[i]["hour(start)"]!=="undefined"){
                      var total_minutes=60*results[i]["hour(start)"]+results[i]["minute(start)"];
                      let con_top=total_minutes*0.8666;//中身の開始位置
                      let con_height=results[i]["hour(timediff(end,start))"]*60*0.8666+results[i]["minute(timediff(end,start))"];//中身の縦幅
                      str_html_job[results[i]["dayofweek(start)"]-1]+="<div class=addition_job id='box"+(results[i]["dayofweek(start)"]-1)+"_"+i+"_job'>"+results[i]["name"]+"</div>";
                      str_css_job[results[i]["dayofweek(start)"]-1]+="#box"+(results[i]["dayofweek(start)"]-1)+"_"+i+"_job"+"{height:"+con_height+"px;position:absolute; top:"+con_top+"px;}"; 
                      }// if(i==results.length-1){
                      //   for(let j=0;j<7;j++){
                      //     console.log("str_htmlの内容:\n"+str_html);
                      //     console.log("str_cssの内容:\n"+str_css);
                      //     $("td.con_"+j).html(str_html[j]+str_html_job[j]+"<style>"+str_css[j]+str_css_job[j]+"</style>");
                      //   }
                        
                      // }
                  }
                  }
                  for(let j=0;j<7;j++){
                    $("td.con_"+j).html(str_html[j]+str_html_job[j]+"<style>"+str_css[j]+str_css_job[j]+"</style>");
                  }
                  text=$('html').html();
                  res.send(text);
                }
                
              );

                console.log('select hour(start),minute(start),dayofweek(start),hour(timediff(end,start)),minute(timediff(end,start)),name from schedule_job where id='+results[0]["id"]+' and start>= "'+str_day[7]+'-'+str_day[8]+'-'+str_day[0]+' 00:00:00" and end<="'+str_day[7]+'-'+str_day[8]+'-'+str_day[6]+' 00:00:00";');
              //今表示されている週のバイト予定だけ取り出せないかやってる
              connection.query(
                'select hour(start),minute(start),dayofweek(start),hour(timediff(end,start)),minute(timediff(end,start)),name from schedule_job where id='+results[0]["id"]+' and start>="'+str_day[7]+'-'+str_day[8]+'-'+str_day[0]+' 00:00:00" and end<="'+str_day[7]+'-'+str_day[8]+'-'+str_day[6]+' 00:00:00";',
                (error,results)=>{
                  console.log(results);
                }
              );

              
        }          
    )
         
    });
  console.log(req.session.name+"がcalendarにアクセスしました");
  }
  
});

//１週戻って表示
app.get('/calendar_prev',(req,res)=>{
  console.log(req.query.date);
  if (check_session(req.session.name)) {
    res.redirect('/login.html');
  }
  else{

    //JQUERYでHTML書き換え
    fs.readFile(__dirname+'/public/html/calendar.html','utf-8',function(err,data){
      let str_html=["","","","","","",""];
      console.log(str_html);
      let str_css=["","","","","","",""];
      let str_html_job=["","","","","","",""];
      let str_css_job=["","","","","","",""];
      let str_day=new Array(13);
      const { window } = new JSDOM(data);
      const $ = require("jquery")(window);
      $("#name").html(req.session.name+"様ようこそ");
      
      str_day=prevmonth(Number(req.query.year),Number(req.query.month),Number(req.query.date));
      $("h1#yearmonth").html(str_day[10]);
      for(let i=0;i<7;i++){
        $("td#"+week[i]).html(str_day[i]);
      }
      $("input#tran_1").attr("value",str_day[7]);
      $("input#tran_2").attr("value",str_day[8]);
      $("input#tran_3").attr("value",str_day[9]);
      connection.query(
        'select id from user where name="'+req.session.name+'";',
        (error, results) => {


          //授業予定表示機能
          connection.query(
            "select def_set.id,schedule_class.name,schedule_class.date,schedule_class.period,schedule_class.class_time,case schedule_class.period when 1 then hour(def_set.class1) when 2 then hour(def_set.class2) when 3 then hour(def_set.class3) when 4 then hour(def_set.class4) when 5 then hour(def_set.class5) when 6 then hour(def_set.class6) end,case schedule_class.period when 1 then minute(def_set.class1) when 2 then minute(def_set.class2) when 3 then minute(def_set.class3) when 4 then minute(def_set.class4) when 5 then minute(def_set.class5) when 6 then minute(def_set.class6) end from schedule_class,def_set where schedule_class.id=def_set.id and def_set.id="+results[0]["id"]+";",
            (error, results) => {
              console.log("講義予定表示に成功しました");
              if(results[0]!=null){

              for(let i=0;i<results.length;i++){
                  // 予定があったときjqueryでhtmlを書き換え
                  var total_minutes=60*results[i]['case schedule_class.period when 1 then hour(def_set.class1) when 2 then hour(def_set.class2) when 3 then hour(def_set.class3) when 4 then hour(def_set.class4) when 5 then hour(def_set.class5) when 6 then hour(def_set.class6) end']+results[i]['case schedule_class.period when 1 then minute(def_set.class1) when 2 then minute(def_set.class2) when 3 then minute(def_set.class3) when 4 then minute(def_set.class4) when 5 then minute(def_set.class5) when 6 then minute(def_set.class6) end '];
                  let con_top=total_minutes*0.8666;//中身の開始位置
                  let con_height=results[i]["class_time"]*0.8666;//中身の縦幅
                  // console.log("td.box_"+(results[i]["date"]));
                  str_html[results[i]["date"]]+="<div class=addition id='box"+results[i]["date"]+"_"+i+"'>"+results[i]["name"]+"</div>";

                  // console.log("#box"+results[i]["date"]+"_"+i+"{width:95%; height:"+con_height+"px; border: 1px solid gray; position:absolute; top:"+con_top+"px;}");
                  str_css[results[i]["date"]]+="#box"+results[i]["date"]+"_"+i+"{height:"+con_height+"px;position:absolute; top:"+con_top+"px;}";
                  
                  // console.log("box"+results[i]["date"]+"_"+i); 
              }
            }
            }
          );


          //バイト予定表示機能
              connection.query(
                'select hour(start),minute(start),dayofweek(start),hour(timediff(end,start)),minute(timediff(end,start)),name from schedule_job where id='+results[0]["id"]+' and start>="'+str_day[7]+'-'+str_day[12]+'-'+str_day[0]+' 00:00:00" and end<="'+str_day[7]+'-'+str_day[11]+'-'+str_day[6]+' 23:59:59";',
                (error,results)=>{
                  if(results[0]!=null){
                  for(let i=0;i<results.length;i++){
                      // バイトがあったときjqueryでhtmlを書き換え
                      var total_minutes=60*results[i]["hour(start)"]+results[i]["minute(start)"];
                      let con_top=total_minutes*0.8666;//中身の開始位置
                      let con_height=results[i]["hour(timediff(end,start))"]*60*0.8666+results[i]["minute(timediff(end,start))"];//中身の縦幅
                      
                      str_html_job[results[i]["dayofweek(start)"]-1]+="<div class=addition_job id='box"+(results[i]["dayofweek(start)"]-1)+"_"+i+"_job'>"+results[i]["name"]+"</div>";
                      str_css_job[results[i]["dayofweek(start)"]-1]+="#box"+(results[i]["dayofweek(start)"]-1)+"_"+i+"_job"+"{height:"+con_height+"px;position:absolute; top:"+con_top+"px;}"; 
                  }
                  }
                  for(let j=0;j<7;j++){
                    $("td.con_"+j).html(str_html[j]+str_html_job[j]+"<style>"+str_css[j]+str_css_job[j]+"</style>");
                  }
                  text=$('html').html();
                  res.send(text);
                }
                
              );

              
        }          
    )
         
    });
  console.log(req.session.name+"がcalendarにアクセスしました");
  }
  
});




app.get('/newid.html', (req, res) => {
  res.sendFile(__dirname+'/public/html/newid.html');
});

app.get('/setting.html', (req, res) => {
    if (check_session(req.session.name)) {
        res.redirect('/login.html');
    }
    else{
      res.sendFile(__dirname+'/public/html/setting.html');
        console.log(req.session.name+"がsettingにアクセスしました");
    }
});

app.get('/addLecture.html', (req, res) => {
    if (check_session(req.session.name)) {
        res.redirect('/login.html');
    }
    else{
      fs.readFile(__dirname+'/public/html/addLecture.html','utf-8',function(err,data){
  
        const { window } = new JSDOM(data);
        const $ = require("jquery")(window);
        let job_select="";
        sch_job="";
        sch_cl="";
        connection.query(
          'select id from user where name="'+req.session.name+'";',
          (error, results) => {

            //バイト先情報表示
            connection.query(
              'select id,store_name from job where id='+results[0]["id"]+';',
              (error,results)=>{
                if(results[0]!=null){
                  console.log(job_select);
                  for(let i=0;i<results.length;i++){
                    job_select+="<option value='"+results[i]["store_name"]+"'>"+results[i]["store_name"]+"</option>";
                    // console.log(job_select);
                    if(i==results.length-1){
                      console.log(job_select);
                      $("#job_select").html(job_select);
                    }
                    
                  }
                }
                else{
                  console.log("削除する予定がありません");
                  $("#job_select").html("<option>あなたはまだ無職です</option>");
                }
                console.log(job_select);
              }
            );

            //バイト予定削除メニュー表示
            connection.query(
              'select year(start),month(start),day(start),hour(start),name,no from schedule_job where id='+results[0]["id"]+';',
              (error,results)=>{
                if(results[0]!=null){
                  for(let i=0;i<results.length;i++){
                    sch_job+="<option value="+results[i]["no"]+">"+results[i]["year(start)"]+'/'+results[i]["month(start)"]+'/'+results[i]["day(start)"]+'/'+results[i]["hour(start)"]+':'+results[i]["name"]+"</option>";
                    if(i==results.length-1){
                      $("#part_delete").html(sch_job);
                    }
                  }
                }
                else{
                  console.log("削除する予定がありません");
                  $("#part_delete").html("<option>バイトの予定はありません</option>");
                }


              }
            );


            //講義予定削除メニュー表示
            connection.query(
              'select period,name,no from schedule_class where id='+results[0]["id"]+';',
              (error,results)=>{
                console.log(results);
                if( results[0]!=null){
                  for(let i=0;i<results.length;i++){
                    sch_cl+="<option value="+results[i]["no"]+">"+results[i]["name"]+"</option>";
                    if(i==results.length-1){
                      console.log("ここに来てる");
                      console.log(sch_cl);
                      $("#class_delete").html(sch_cl);
                      console.log($("#class_delete").text());
                      text=$("html").html();
                      res.send(text);
                    }
                  }
                }
                else{
                  console.log("削除する予定がありません");
                  $("#class_delete").html("<option>予定がありません</option>");
                  text=$("html").html();
                  res.send(text);
                }
              }
            );
        });
      });
      console.log(req.session.name+"がaddLectureにアクセスしました");
    }
});

app.get('/default.html', (req, res) => {
    if (check_session(req.session.name)) {
        res.redirect('/login.html');
    }
    else{
        res.sendFile(__dirname+'/public/html/default.html');
        console.log(req.session.name+"がdefaultにアクセスしました");
    }
});


app.get('/test.html', (req, res) => {
    res.send(req.query);
});
app.get('/test',(req,res)=>{
  res.send(req.query.title);
});



//ログイン処理
app.post('/login', (req, res) => {
  console.log('--- post() /login called ---');
  console.log(req.body.name);
  console.log(req.body.password);

  connection.query(
    'select password from user where name="'+req.body.name+'";',
    (error, results) => {
      console.log("SQL送信に成功しました");
      console.log(typeof(results[0]));
      if((typeof results[0]==="undefined")){
        console.log("ログインに失敗しました");
        res.redirect('/login.html');
      }
      else{
        if((req.body.password==results[0].password)){
          console.log("ログインに成功しました");
          req.session.regenerate((err)=>{
              req.session.name=req.body.name;
              res.redirect('/calendar.html');   
          })
        }
        else{
          console.log("ログインに失敗しました");
          res.redirect('/login.html');
        }
      }
    }
  );    
});




//講義予定追加
app.post('/newsch', (req, res) => {
  console.log('--- get() /newsch called ---');
  console.log('select id from user where name="'+req.session.name);
  connection.query(
      'select id from user where name="'+req.session.name+'";',
      (error, results) => {
        let id=results[0]["id"];
        console.log("SQL送信に成功しました");
       connection.query(
          'select id,class_time from def_set where id='+id+';',
          (error,results) =>{
          let class_time=results[0]["class_time"];
          connection.query(
            'select max(no) from schedule_class;',
            (error,results)=>{
              connection.query(
                'INSERT INTO schedule_class(id,class_time,period,room,name,date,no) VALUES ('+id+','+class_time+','+req.body.class_select+',"'+req.body.room+'","'+req.body.c_name+'",'+req.body.day_select+','+(results[0]["max(no)"]+1)+');',
                (error, results) => {
                  console.log("講義予定追加に成功しました");
                }
              );
            }
          )
          }
        );
      }          
  )
  res.redirect('./calendar.html');
});


//基本プロフィール変更
app.post("/newset",(req,res)=>{
    console.log("--- post() /newset called ---");
    connection.query(
      'select id from user where name="'+req.session.name+'";',
      (error, results) => {
        console.log("SQL送信に成功しました");
        console.log(typeof results[0]["id"]);
        console.log(results[0]["id"]);

        console.log('update def_set set year='+req.body.number+',class_time='+req.body.interval+' where id='+results[0]["id"]+';');
        connection.query(
          'update def_set set year='+req.body.number+',class_time='+req.body.interval+' where id='+results[0]["id"]+';',
          (error, results) => {
            console.log("設定変更成功");
          }
        )

      }          
  )
  res.redirect('./calendar.html');
});


//バイト先追加
app.post('/jobset',(req,res)=>{
  connection.query(
    'select id from user where name="'+req.session.name+'";',
      (error, results) => {
        connection.query(
          'insert into job(id,store_name,pay) value ('+results[0]["id"]+',"'+req.body.store+'",'+req.body.pay+');',
          (error,results) =>{
            console.log("新しいバイト先が追加されました");
          }
        )
      }
  )
  res.redirect('/calendar.html');
});



//アルバイト予定追加
app.post('/newjob', (req, res) => {
  console.log('--- get() /newjob called ---');
  console.log(req.session.name);
  connection.query(
      'select id from user where name="'+req.session.name+'";',
      (error, results) => {
        console.log("SQL送信に成功しました");
        console.log(typeof results[0]["id"]);
        console.log(results[0]["id"]);
        console.log(req.body.job_select);
        console.log(req.body.date);
        console.log(req.body.job_start);
        console.log(req.body.job_end);
        let id=results[0]["id"];
        connection.query(
          'select max(no) from schedule_job;',
          (error,results)=>{
            console.log('INSERT INTO schedule_job(id,start,end,name,no) VALUES ('+id+',"'+req.body.date+' '+req.body.job_start+'","'+req.body.date+' '+req.body.job_end+'","'+req.body.job_select+'",'+(results[0]["max(no)"]+1)+');');
            connection.query(
              'INSERT INTO schedule_job(id,start,end,name,no) VALUES ('+id+',"'+req.body.date+' '+req.body.job_start+'","'+req.body.date+' '+req.body.job_end+'","'+req.body.job_select+'",'+(results[0]["max(no)"]+1)+');',
              (error, results) => {
                console.log("バイト予定追加成功");
              }
            )

          }
        )
        

      }          
  )
  res.redirect('/calendar.html');
});

//アルバイト予定削除
app.post('/deljob', (req, res) => {
      connection.query(
        'delete from schedule_job where no='+req.body.part_delete+';',
        (error,results)=>{
          console.log("バイト予定を削除しました");
        }
      );
      res.redirect('/calendar.html');
});


//講義予定削除
app.post('/delcl', (req, res) => {
  connection.query(
    'delete from schedule_class where no='+req.body.class_delete+';',
    (error,results)=>{
      console.log("講義予定を削除しました");
    }
  );
  res.redirect('/calendar.html');
});

//ユーザ新規作成
app.post('/newid', (req, res) => {
    console.log('--- post() /newid called ---');
    console.log(req.body.name);
    console.log(req.body.password);
    connection.query(
        'select count(*) from user;',
        (error, results) => {
          console.log("SQL送信に成功しました");
          console.log(typeof results[0]["count(*)"]);
          console.log('INSERT INTO user(id,name,password) VALUES ('+results[0]["count(*)"]+',"'+req.body.name+'","'+req.body.password+'")');
          connection.query(
            'INSERT INTO user(id,name,password) VALUES ('+results[0]["count(*)"]+',"'+req.body.name+'","'+req.body.password+'")',
            (error, results) => {
              console.log("ユーザー追加に成功しました");
            }
        );
        }
    );
    req.session.name=req.body.name;          
    res.redirect('/default.html');
  });

//初期設定登録
app.post('/default',(req,res)=>{
  connection.query(
    'select id from user where name="'+req.session.name+'";',
    (error,results)=>{
      console.log(results[0]["id"]);
      console.log('insert into def_set(id,class1,class2,class3,class4,class5,class6) values('+results[0]["id"]+',"'+req.body.start_1+'","'+req.body.start_2+'","'+req.body.start_3+'","'+req.body.start_4+'","'+req.body.start_5+'","'+req.body.start_6+'");');
      connection.query(
        'insert into def_set(id,class1,class2,class3,class4,class5,class6,class_time) values('+results[0]["id"]+',"'+req.body.start_1+'","'+req.body.start_2+'","'+req.body.start_3+'","'+req.body.start_4+'","'+req.body.start_5+'","'+req.body.start_6+'",'+req.body.interval+');',
        (error,results)=>{
          console.log("初期設定に成功しました");
      });
      connection.query(
        'insert into job(id,store_name,pay) values('+results[0]["id"]+',"'+req.body.store+'","'+req.body.pay+'");',
        (error,results)=>{
          console.log("バイト先設定完了");
        }
      )
  });

  res.redirect('/calendar.html');

});




  //セッション設定
  app.use((req, res, next) => {
    if (typeof req.session.name==="undefined") {
        console.log("I'm here");
        console.log("セッションが作られていないか切れています");
        res.redirect('/login.html');
    }
    else{
      next();
      console.log("セッション済みです");
    } 
  });
  

app.listen(8000,() => {
    console.log("URL=>localhost:8000");
});






function check_session(name){
  var flg;
  if (typeof name==="undefined") {
    console.log("I'm here こちらは関数check_sessionです");
    console.log("セッションが作られていないか切れています");
    flg=1;
  }
  else{
    flg=0;
  }
  return flg;
}





//-------------------------------------------------------------------------------------------------------------------------------------------------


function nextmonth(year,month,s_date){
  console.log(year+month+s_date);
  str_html=new Array(13);
  date= new Date();
  date.setFullYear(year);
  date.setMonth(month-1);
  date.setDate(s_date+7);
  
       //週の日付を表示

       for(let i=0;i<7;i++){
            
            n = date.getDate()+(i-date.getDay());
            z = days[date.getMonth()];//その月の日数を記憶
            m = date.getMonth();     //何月かを記憶
            if(m == 0)     m = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
            if(i == 0)     dd1 = n;
            if(i == 6)     dd2 = n;
            
            if(n < 1){ 
                 p = m - 1;      //１ヶ月前を記憶
                 q = days[p] + n;    //前の月の月末の日から引く
                 if(i==0){
                      dd1 = q;
                 }
                //  $("td#"+week[i]).html(q);
                str_html[i]=q;
            
            }else if(n > z){
                //  $("td#"+week[i]).html(n - days[m]);
                 str_html[i]=n-days[m];
                 if(i == 6){
                      dd2 = n-days[m];
                 }
            }else 
                //  $("td#"+week[i]).html(n);
                 str_html[i]=n;
       }


       
       day1 = date.getDate() //日付取得
       youbi = date.getDay()
       mon = date.getMonth();     //何月かを記憶
       b=0;

       if((day1 - youbi) < 1){

            if(mon == 0){ 
                 mon = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
            }   
                 
            p = mon - 1;      //１ヶ月前を記憶
            q = days[p] + day1;    //前の月の月末の日から引く
            //$("h1#yearmonth").html(date.getFullYear()+" "+mon+"/"+dd1+"~"+(date.getMonth()+1)+"/"+(day1 + 6 - youbi));
            str_html[10]=date.getFullYear()+" "+mon+"/"+dd1+"~"+(date.getMonth()+1)+"/"+(day1 + 6 - youbi);
            str_html[11]=date.getMonth()+1;
            str_html[12]=mon;

       
       }else if((day1 + (6-youbi)) > days[mon]){
            if(mon == 11){
                //  $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+1+"/"+(day1 + 6-youbi));
                strl_html[10]=date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+1+"/"+(day1 + 6-youbi);
                str_html[11]=1;
                str_html[12]=date.getMonth()+1;    
            }     
            // $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+(date.getMonth()+2)+"/"+(day1 + 6-youbi - days[mon]));
            str_html[10]=date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+(date.getMonth()+2)+"/"+(day1 + 6-youbi - days[mon]);
            str_html[11]=date.getMonth()+2;
            str_html[12]=date.getMonth()+1;

       }else {
            
            // $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay()));
            str_html[10]=date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay());
            str_html[11]=date.getMonth()+1;
            str_html[12]=date.getMonth()+1;

       }
       str_html[7]=date.getFullYear();
       str_html[9]=day1;
       str_html[8]=date.getMonth()+1;

       
  return str_html;

  
} 




// //-------------------------------------------------------------------------------------------------------------------------------------------------


function prevmonth(year,month,s_date){
  str_html=new Array(13);
  date= new Date();
  date.setFullYear(year);
  date.setMonth(month-1);
  date.setDate(s_date-7);

       //週の日付を表示
       for(let i=0;i<7;i++){

            n = date.getDate()+(i-date.getDay());
            console.log(n);
            z = days[date.getMonth()];
            m = date.getMonth();     //何月かを記憶
            if(m == 0)     m = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
            
            if(i == 0)     dd1 = n;
            if(i == 6)     dd2 = n;
            

            if(n < 1){  
                 p = m - 1;      //１ヶ月前を記憶
                 q = days[p] + n;    //前の月の月末の日から引く
                
                //  $("td#"+week[i]).html(q);
                str_html[i]=q;
                
                 if(i == 0){
                      dd1 = q;
                 }
            }else if(n > z){
                 console.log(n-days[m]);
                //  $("td#"+week[i]).html(n-days[m]);
                 str_html[i]=n-days[m];
                 if(i == 6){
                      dd2=n-days[m]
                 }
                 
            }else str_html[i]=n;
            // $("td#"+week[i]).html(n);
       }

       day1 = date.getDate() //日付取得
       youbi = date.getDay()
       mon = date.getMonth();     //何月かを記憶
       b=0;

       if((day1 - youbi) < 1){

            if(mon == 0){ 
                 mon = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
            }   
                 
            p = mon - 1;      //１ヶ月前を記憶
            q = days[p] + day1;    //前の月の月末の日から引く
            // $("h1#yearmonth").html(date.getFullYear()+" "+mon+"/"+dd1+"~"+(date.getMonth()+1)+"/"+(day1 + 6 - youbi));
            str_html[10]=date.getFullYear()+" "+mon+"/"+dd1+"~"+(date.getMonth()+1)+"/"+(day1 + 6 - youbi);
            str_html[11]=date.getMonth()+1;
            str_html[12]=mon;
       }else if((day1 + (6-youbi)) > days[mon]){
            if(mon == 11){
                //  $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+1+"/"+(day1 + 6-youbi));
                 str_html[10]=date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+1+"/"+(day1 + 6-youbi);
                 str_html[11]=1;
                 str_html[12]=date.getMonth()+1;     
            }     
            // $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+(date.getMonth()+2)+"/"+(day1 + 6-youbi - days[mon]));
            str_html[10]=date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+(date.getMonth()+2)+"/"+(day1 + 6-youbi - days[mon]);
            str_html[11]=date.getMonth()+2;
            str_html[12]=date.getMonth()+1;
       }else {
            
            // $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay()));
            str_html[10]=date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay());
            str_html[11]=date.getMonth()+1;
            str_html[12]=date.getMonth()+1;
       }
  
       str_html[7]=date.getFullYear();
       str_html[9]=day1;
       str_html[8]=date.getMonth()+1;
  return str_html;
}

// //-------------------------------------------------------------------------------------------------------------------------------------------------


function today_week(){
       //今日の年、月を表示
       today_date=new Array(13);
       date= new Date();

       day1 = date.getDate() //日付取得
       youbi = date.getDay()
       mon = date.getMonth();     //何月かを記憶
       b=0;
       if((day1 - youbi) < 1){

            if(mon == 0){ 
                 mon = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
            }   
                 
            p = mon - 1;      //１ヶ月前を記憶
            q = days[p] + day1;    //前の月の月末の日から引く
            //$("h1#yearmonth").html(date.getFullYear()+" "+(mon)+"/"+(q)+"~"+(date.getMonth()+1)+"/"+(date.getDate()));
            today_date[10]=date.getFullYear()+" "+(mon)+"/"+(q)+"~"+(date.getMonth()+1)+"/"+(date.getDate());
            today_date[11]=date.getMonth()+1;
            today_date[12]=mon;
       }else if((day1 + (6-youbi)) > days[mon]){
            if(mon == 11){
                //  $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+1+"/"+(day1 + 6-youbi - days[mon]));
                //  $("input.tran").val(day1);
                 today_date[10]=date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+1+"/"+(day1 + 6-youbi - days[mon]);
                 today_date[11]=1;
                 today_date[12]=date.getMonth()+1;
            }     
            // $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+(date.getMonth()+2)+"/"+(day1 + 6-youbi - days[mon]));
            // $("input.tran").val(day1);
            today_date[10]=date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+(date.getMonth()+2)+"/"+(day1 + 6-youbi - days[mon]);
            today_date[11]=date.getMonth()+2;
            today_date[12]=date.getMonth()+1;
       }else {
            
            // $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay()));
            // $("input.tran").val(day1);
            today_date[10]=date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay());
            today_date[11]=date.getMonth()+1;
            today_date[12]=date.getMonth()+1;
       }
       today_date[7]=date.getFullYear();
       today_date[9]=day1;
       today_date[8]=date.getMonth()+1;


       
       
       //今日の月に合わせたカレンダーの日の表示
       date1= new Date(date.getFullYear(),date.getMonth(),1);
       
       


       
       a = 0;
       //週の日付を表示
       for(let i=0;i<7;i++){
            n = date.getDate()+(i-date.getDay());
            
            z = days[date.getMonth()];
            
            if(n < 1){
                 
                 m = date.getMonth();     //何月かを記憶
                 
                 if(m == 0){ 
                      m = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））

                 }   
                 p = m - 1;      //１ヶ月前を記憶
                 
                 q = days[p] + n;    //前の月の月末の日から引く
                 
                //  $("td#"+week[i]).html(q);
                 today_date[i]=q;
            }else if(n > z){
                 a+=1
                //  $("td#"+week[i]).html(a);
                 today_date[i]=a;

            }else today_date[i]=n;
            // $("td#"+week[i]).html(n);
                  
       }
       
       return today_date;
}
