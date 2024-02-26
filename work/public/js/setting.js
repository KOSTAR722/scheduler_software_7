// $('button:not([href^="#"]):not([target])').on('click', function(e){ 
//   e.preventDefault(); 
//   //$("#splash-logo").delay(1200).fadeOut('slow');//ロゴを1.2秒でフェードアウトする記述
  
//   //=====ここからローディングエリア（splashエリア）を1.5秒でフェードアウトした後に動かしたいJSをまとめる
//   $("#splash").delay(1500).fadeOut('slow');//ローディングエリア（splashエリア）を1.5秒でフェードアウトする記述
  
//   $('body').addClass('appear');//フェードアウト後bodyにappearクラス付与

//   url = $(this).attr('action'); // 遷移先のURLを取得
//     if (url !== '') {
//       setTimeout(function(){
//         window.location = url;  // 3秒後に取得したURLに遷移
//       }, 3000);
//       }; 

// });


//=====ここまでローディングエリア（splashエリア）を1.5秒でフェードアウトした後に動かしたいJSをまとめる
$('.splashbg').on('animationend', function() {  

});
  //=====ここまで背景が伸びた後に動かしたいJSをまとめる


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

//選択プルダウンのデコレーション
$(".custom-select1").each(function() {
  var classes = $(this).attr("class"),
      id      = $(this).attr("id"),
      name    = $(this).attr("name");
  var template =  '<div class="' + classes + '">';
      template += '<span class="custom-select1-trigger">' + $(this).attr("placeholder") + '</span>';
      template += '<div class="custom-options1">';
      $(this).find("option").each(function() {
        template += '<span class="custom-option1 ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
      });
  template += '</div></div>';
  
  $(this).wrap('<div class="custom-select1-wrapper"></div>');
  $(this).hide();
  $(this).after(template);
});
$(".custom-option1:first-of-type").hover(function() {
$(this).parents(".custom-options1").addClass("option-hover1");
}, function() {
$(this).parents(".custom-options1").removeClass("option-hover1");
});
$(".custom-select1-trigger").on("click", function() {
$('html').one('click',function() {
  $(".custom-select1").removeClass("opened");
});
$(this).parents(".custom-select1").toggleClass("opened");
event.stopPropagation();
});
$(".custom-option1").on("click", function() {
$(this).parents(".custom-select1-wrapper").find("select").val($(this).data("value"));
$(this).parents(".custom-options1").find(".custom-option1").removeClass("selection");
$(this).addClass("selection");
$(this).parents(".custom-select1").removeClass("opened");
$(this).parents(".custom-select1").find(".custom-select1-trigger").text($(this).text());
});

$(".custom-select2").each(function() {
  var classes = $(this).attr("class"),
      id      = $(this).attr("id"),
      name    = $(this).attr("name");
  var template =  '<div class="' + classes + '">';
      template += '<span class="custom-select2-trigger">' + $(this).attr("placeholder") + '</span>';
      template += '<div class="custom-options2">';
      $(this).find("option").each(function() {
      template += '<span class="custom-option2 ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
      });
  template += '</div></div>';
  
  $(this).wrap('<div class="custom-select2-wrapper"></div>');
  $(this).hide();
  $(this).after(template);
});
$(".custom-option2:first-of-type").hover(function() {
  $(this).parents(".custom-options2").addClass("option-hover2");
}, function() {
  $(this).parents(".custom-options2").removeClass("option-hover2");
});
$(".custom-select2-trigger").on("click", function() {
  $('html').one('click',function() {
  $(".custom-select2").removeClass("opened");
  });
  $(this).parents(".custom-select2").toggleClass("opened");
  event.stopPropagation();
});
$(".custom-option2").on("click", function() {
  $(this).parents(".custom-select2-wrapper").find("select").val($(this).data("value"));
  $(this).parents(".custom-options2").find(".custom-option2").removeClass("selection");
  $(this).addClass("selection");
  $(this).parents(".custom-select2").removeClass("opened");
  $(this).parents(".custom-select2").find(".custom-select2-trigger").text($(this).text());
});
