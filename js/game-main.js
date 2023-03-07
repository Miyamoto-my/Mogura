const DIFF_ID = [
    ['elementary', '初級'],
    ['intermediate', '中級'],
    ['advanced', '上級'],
];

class Statistics {
    constructor(tableId, clickCount, clickValidCount) {
        this.clickDistributionElem = document.getElementById(tableId);
        this.clickCount = clickCount;
        this.clickValidCount = clickValidCount;

        this.clickDistribution = new Array(9);

        this.setClickDistribution();
        this.drowChart();
    }

    setClickDistribution() {
        this.totalClickCount = this.clickCount.reduce((sum, item) => sum + item);
        this.totalClickValidCount = this.clickValidCount.reduce((sum, item) => sum + item);
        
        for (let i in this.clickCount) {
            this.clickDistribution[i] = this.clickCount[i] / this.totalClickCount * 100;
        }

        this.cDElems = this.clickDistributionElem.getElementsByTagName('td');
    }

    drowChart() {

        // clickDistribution
        for (let i = 0; i < this.cDElems.length; i ++) {
            this.cDElems[i].className = getcDClassName(this.clickDistribution[i]);
            this.cDElems[i].innerText = (this.clickCount != 0) ?
                String(
                    Math.round(this.clickValidCount[i]/this.clickCount[i]*1000)/10
                    )+"%" : "0%" ;
        }

        function getcDClassName(value) {
            if (value <= 10) {
                return "cD-0";
            } else if (value <= 20) {
                return "cD-1";
            } else if (value <= 30) {
                return "cD-2";
            } else if (value <= 40) {
                return "cD-3";
            } else if (value <= 50) {
                return "cD-4";
            } else if (value <= 60) {
                return "cD-5";
            } else if (value <= 70) {
                return "cD-6";
            } else if (value <= 80) {
                return "cD-7";
            } else if (value <= 90) {
                return "cD-8";
            } else if (value <= 99) {
                return "cD-9";
            } else {
                return "cd-10";
            }
        }
    }

}

window.onload = () => {
    const BOARD = new Board('board', "timer-text", "hits-text", "logList-ol", 'to_resultView-btn');
    console.log(BOARD);

    let settingView = document.getElementById('settingView');
    let gameView = document.getElementById('gameView');
    let resultView = document.getElementById('resultView');
    
    // view遷移
    document.getElementById('to_gameView-btn').addEventListener('click', () => {
        settingView.style.display = "none";
        gameView.style.display = "inline";
    });
    document.getElementById('to_settingView-btn').addEventListener('click', () => {
        settingView.style.display = "inline";
        gameView.style.display = "none";
    });
    document.getElementById('to_resultView-btn').addEventListener('click', () => {
        resultView.style.display = "inline";
        gameView.style.display = "none";

        console.log(BOARD);
        new Statistics('clickDistribution', BOARD.clickCount, BOARD.clickValidCount);
    });

    /** setting view 
     ---------------------------------------------------------------------------- */
    // 難易度設定
    const DIFFS_BTN = document.getElementsByClassName('diff-btn');
    for (let i = 0; i < DIFFS_BTN.length; i ++) {
        DIFFS_BTN[i].addEventListener('click', () => {
            BOARD.setGameLevel(DIFF_ID[i][0]);
            let gameLevelTextElems = document.getElementsByClassName('gameLevel-text');
            for (let j = 0; j < gameLevelTextElems.length; j ++) {
                gameLevelTextElems[j].innerText = DIFF_ID[i][1];
            };
        })
    }

    /** game view
     ---------------------------------------------------------------------------- */
    // gamestart
    document.getElementById('gameStart-btn').addEventListener('click', (e) => {
        e.target.disabled = true;
        document.getElementById('to_settingView-btn').disabled = true;
        BOARD.gameStart();
    });

    
    /** result view
     ---------------------------------------------------------------------------- */
    

}

a = [0, 2, 3]

let b = a.reduce((sum, item) => sum + item);

console.log(a, b, a[0]/b*100, 0/0);