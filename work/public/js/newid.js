
function submitCheck() {

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  //確認
  //window.confirm("ID: " + username + "\n" + "パスワード: " + password);


if(username == "" || password == ""){
  alert("未入力の項目があります。");
  return false;
}
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