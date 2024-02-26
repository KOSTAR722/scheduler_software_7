$('a:not([href^="#"]):not([target])').on('click', function(e){
     e.preventDefault(); 
     //$("#splash-logo").delay(1200).fadeOut('slow');//ロゴを1.2秒でフェードアウトする記述
     
     //=====ここからローディングエリア（splashエリア）を1.5秒でフェードアウトした後に動かしたいJSをまとめる
     $("#splash").delay(1100).fadeOut('slow');//ローディングエリア（splashエリア）を1.5秒でフェードアウトする記述
     
     $('body').addClass('appear');//フェードアウト後bodyにappearクラス付与
   
     url = $(this).attr('href'); // 遷移先のURLを取得
       if (url !== '') {
         setTimeout(function(){
           window.location = url;  // 3秒後に取得したURLに遷移
         }, 3000);
         }; 
   
   });

const week=["sun","mon","tue","wed","thu","fri","sat"];

var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//初期表示

// function today_week(){
//      $(function(){
//           //今日の年、月を表示
//           date= new Date();
//           //$("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay()));

          
//           day1 = date.getDate() //日付取得
//           youbi = date.getDay()
//           mon = date.getMonth();     //何月かを記憶
//           b=0;
//           if((day1 - youbi) < 1){

//                if(mon == 0){ 
//                     mon = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
//                }   
                    
//                p = mon - 1;      //１ヶ月前を記憶
//                q = days[p] + day1;    //前の月の月末の日から引く
//                $("h1#yearmonth").html(date.getFullYear()+" "+(mon)+"/"+(q)+"~"+(date.getMonth()+1)+"/"+(date.getDate()));
//           }else if((day1 + (6-youbi)) > days[mon]){
//                if(mon == 11){
//                     $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+1+"/"+(day1 + 6-youbi - days[mon]));
//                     $("input.tran").val(day1);    
//                }     
//                $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+(date.getMonth()+2)+"/"+(day1 + 6-youbi - days[mon]));
//                $("input.tran").val(day1); 
//           }else {
               
//                $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay()));
//                $("input.tran").val(day1);
//           }
          
//           //今日の月に合わせたカレンダーの日の表示
//           date1= new Date(date.getFullYear(),date.getMonth(),1);
          
          


          
//           a = 0;
//           //週の日付を表示
//           for(let i=0;i<7;i++){
//                n = date.getDate()+(i-date.getDay());
               
//                z = days[date.getMonth()];
               
//                if(n < 1){
                    
//                     m = date.getMonth();     //何月かを記憶
                    
//                     if(m == 0){ 
//                          m = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））

//                     }   
//                     p = m - 1;      //１ヶ月前を記憶
                    
//                     q = days[p] + n;    //前の月の月末の日から引く
                    
//                     $("td#"+week[i]).html(q);
//                }else if(n > z){
//                     a+=1
//                     $("td#"+week[i]).html(a);

//                }else $("td#"+week[i]).html(n);
//           }
          
//      });
// }


//-------------------------------------------------------------------------------------------------------------------------------------------------


// function nextmonth(){
//      date.setDate(date.getDate()+7);
//      $(function(){
//           //週の日付を表示

//           for(let i=0;i<7;i++){
               
//                n = date.getDate()+(i-date.getDay());
//                z = days[date.getMonth()];
//                m = date.getMonth();     //何月かを記憶
//                if(m == 0)     m = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
//                if(i == 0)     dd1 = n;
//                if(i == 6)     dd2 = n;
               
//                if(n < 1){ 
//                     p = m - 1;      //１ヶ月前を記憶
//                     q = days[p] + n;    //前の月の月末の日から引く
//                     if(i==0){
//                          dd1 = q;
//                     }
//                     $("td#"+week[i]).html(q);
               
//                }else if(n > z){
//                     $("td#"+week[i]).html(n - days[m]);
//                     if(i == 6){
//                          dd2 = n-days[m];
//                     }
//                }else 
//                     $("td#"+week[i]).html(n);
//           }


          
//           day1 = date.getDate() //日付取得
//           youbi = date.getDay()
//           mon = date.getMonth();     //何月かを記憶
//           b=0;

//           if((day1 - youbi) < 1){

//                if(mon == 0){ 
//                     mon = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
//                }   
                    
//                p = mon - 1;      //１ヶ月前を記憶
//                q = days[p] + day1;    //前の月の月末の日から引く
//                $("h1#yearmonth").html(date.getFullYear()+" "+mon+"/"+dd1+"~"+(date.getMonth()+1)+"/"+(day1 + 6 - youbi));
          
//           }else if((day1 + (6-youbi)) > days[mon]){
//                if(mon == 11){
//                     $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+1+"/"+(day1 + 6-youbi));     
//                }     
//                $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+(date.getMonth()+2)+"/"+(day1 + 6-youbi - days[mon]));
//           }else {
               
//                $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay()));
//           }
          
               
//      });

     
// } 




//-------------------------------------------------------------------------------------------------------------------------------------------------


// function prevmonth(){
//      date.setDate(date.getDate()-7);
//      $(function(){
//           //週の日付を表示
//           for(let i=0;i<7;i++){

//                n = date.getDate()+(i-date.getDay());
//                console.log(n);
//                z = days[date.getMonth()];
//                m = date.getMonth();     //何月かを記憶
//                if(m == 0)     m = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
               
//                if(i == 0)     dd1 = n;
//                if(i == 6)     dd2 = n;
               

//                if(n < 1){  
//                     p = m - 1;      //１ヶ月前を記憶
//                     q = days[p] + n;    //前の月の月末の日から引く

//                     $("td#"+week[i]).html(q);
//                     if(i == 0){
//                          dd1 = q;
//                     }
//                }else if(n > z){
//                     console.log(n-days[m]);
//                     $("td#"+week[i]).html(n-days[m]);
//                     if(i == 6){
//                          dd2=n-days[m]
//                     }
                    
//                }else $("td#"+week[i]).html(n);
//           }

//           day1 = date.getDate() //日付取得
//           youbi = date.getDay()
//           mon = date.getMonth();     //何月かを記憶
//           b=0;

//           if((day1 - youbi) < 1){

//                if(mon == 0){ 
//                     mon = 12;   //もし今が１月だったら１２月にしてね（次の計算のときに１２月に戻すため（配列が0~11のため））
//                }   
                    
//                p = mon - 1;      //１ヶ月前を記憶
//                q = days[p] + day1;    //前の月の月末の日から引く
//                $("h1#yearmonth").html(date.getFullYear()+" "+mon+"/"+dd1+"~"+(date.getMonth()+1)+"/"+(day1 + 6 - youbi));
          
//           }else if((day1 + (6-youbi)) > days[mon]){
//                if(mon == 11){
//                     $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+1+"/"+(day1 + 6-youbi));     
//                }     
//                $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(day1-youbi)+"~"+(date.getMonth()+2)+"/"+(day1 + 6-youbi - days[mon]));
//           }else {
               
//                $("h1#yearmonth").html(date.getFullYear()+" "+(date.getMonth()+1)+"/"+(date.getDate()-date.getDay())+"~"+(date.getMonth()+1)+"/"+(date.getDate()+6-date.getDay()));
//           }
//      });
// }

// today_week();




