
// $(function() {
//   // ハッシュリンク(#)と別ウィンドウでページを開く場合はスルー
//   $('input:not([href^="#"]):not([target]):not([type^="text"]):not([type^="password"])').on('click', function(e){  //タグはinput
//     e.preventDefault(); // ナビゲートをキャンセル
//     url = $(this).attr('formaction'); // 遷移先のURLを取得    //
//     if (url !== '') {
//       $('body').addClass('fadeout');  // bodyに class="fadeout"を挿入
//       setTimeout(function(){
//         window.location = url;  // 1秒後に取得したURLに遷移
//       }, 1000);
//     }
//     return false;
//   });
// });


function submitCheck() {

  var username = document.getElementsByName('username');
  var password = document.getElementsByName('password');
  window.confirm("ID: " + username[0].value + "\n" + "パスワード: " + password[0].value);

}

const CLASSNAME = "-visible";
const TIMEOUT = 1000;
const $target = $(".title");

//タイトルロゴを動かす関数
setTimeout(() => {
    $target.addClass(CLASSNAME);
}, TIMEOUT);

//入力フォームの文字列を移動させる関数
$('input').on('focusin', function() {
$(this).parent().find('label').addClass('active');
});
if($(this).hasClass('active')){
console.log("s");
}
$('input').on('focusout', function() {
if (!this.value) {
  $(this).parent().find('label').removeClass('active');
}
});