/*********************************
 mogura.js
  Created by M.Nogi on 2021.06.09
*********************************/

//　タイマー値(秒)
const TIMER_SECONDS = 30;

//ミリ秒
const ONE_MS = 1000;

// タイマー開始時の日時
let startDate = null;

// カウントダウン用のタイマーIDを保持する変数
let countdownTimer = null;

// もぐらのトグル表示用のタイマーIDを保持する変数
let toggleTimer = null;

// 残り時間増減
let timeAddCut = null;

// ヒット数
let hitsCount = null;

//　画像src
const ALL_IMAGE = {
  hole : "./images/hole.png", mogura : "./images/mogura.png", bakudan : "./images/bakudan.png", onigiri : "./images/onigiri.png"
};

//　各表示している画像の種類
let currentImage = {
  1 : "hole", 2 : "hole", 3 : "hole", 4 : "hole", 5 : "hole", 6 : "hole", 7 : "hole", 8 : "hole", 9 : "hole"
};


/**
 * Start! ボタン押したとき
 */
function startTimer(){
    reverseTF("true");
    startDate = new Date();
    finishDate = TIMER_SECONDS * ONE_MS;

    countdownTimer = setInterval(function() {
      let currentDate = new Date();

      let timerString = document.getElementById("timerString");
      let remainSeconds = Math.round((finishDate - (currentDate - startDate)) / ONE_MS);
      timerString.innerHTML = remainSeconds;

      console.log(timeAddCut);
      if(timeAddCut === "add"){
        finishDate += 5 * ONE_MS;
        timeAddCut = null;
      }else if(timeAddCut === "cut"){
        finishDate -= 5 * ONE_MS;
        timeAddCut = null;
      }
      console.log(timeAddCut);

      if (remainSeconds <= 0){
          // タイマー止める
          clearInterval(countdownTimer);
          clearInterval(toggleTimer);
          reverseTF("");

          setTimeout(function() { alert("Finished!!");}, 50); // ちょと遅らせる
      }

    },ONE_MS);
    moguraHideShow();

}

let moguraHideShow = function(){
  console.log("moguraHideShow run");
  for (let imageNum = 1; imageNum <= 9;imageNum ++){

    // 画像オブジェクトの取得
    let displayImage = document.getElementById("displayImage" + imageNum);

    // もぐらをたたいた時の動作設定
    displayImage.addEventListener("click", function() {
      
      /*　以下4ステップとif文内のtext　*/
      let scroll = document.getElementById("scroll");
      let ol = document.getElementById("logString");
      let li = document.createElement("li");
      let text = null;

      if (currentImage[imageNum] === "mogura"){
        hitsCount++;
        text = document.createTextNode("もぐら");
      } else if (currentImage[imageNum] === "onigiri"){
        timeAddCut = "add";
        text = document.createTextNode("おにぎり：残り時間5秒追加");
      } else if(currentImage[imageNum] === "bakudan"){
        timeAddCut = "cut";
        text = document.createTextNode("爆弾：残り時間5秒減少");
      } else{
        text = document.createTextNode("ミスクリック");
      }

      console.log("痛いンゴ");
      document.getElementById("hitsString").innerHTML = hitsCount;
      displayImage.src = ALL_IMAGE.hole;
      currentImage[imageNum] = "hole";

      /** 以下３ステップ */ 
      li.appendChild(text);
      ol.appendChild(li);
      scroll.scrollTop = scroll.scrollHeight;
    });
    

    let appearMogura = function() {
      toggleTimer = setTimeout( function() {
        console.log("run== " + imageNum + "mo/ho== " + currentImage[imageNum]);
        
        if (currentImage[imageNum] === "hole"){ // hole が表示されているなら
          //ばくだん、おにぎり、爆弾どれかをランダムで出現させる
          /* random関数を使って値が
           * 9     8  7  6  5 4 3 2 1 0
           *       ↑        ↑         ↑
           * onigiri, bakudan,   mogura
           */
          let randomvalue = Math.random() * 10;
          if (randomvalue < 5){                 //mogura
            displayImage.src = ALL_IMAGE.mogura;
            currentImage[imageNum] = "mogura";
          } else if (randomvalue < 8){          //bakudan
            displayImage.src = ALL_IMAGE.bakudan;
            currentImage[imageNum] = "bakudan";
          } else {                              //onigiri
            displayImage.src = ALL_IMAGE.onigiri;
            currentImage[imageNum] = "onigiri";
          }
        } else {                                // hole 以外が表示されているなら
          displayImage.src = ALL_IMAGE.hole;
          currentImage[imageNum] = "hole";
        }

        appearMogura();
      }, Math.random() * 3000);
    };

    appearMogura();
  }
}

//ボタンを一度しか押せなくする。
function reverseTF(Reverse){
  var bt_id = document.getElementById("start_bt");
  if(Reverse === true){
      bt_id.style.color = "#000000";
  }
  bt_id.disabled = Reverse;
}
