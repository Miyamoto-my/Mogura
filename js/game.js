
const HOLES_ID = [
    'none', 'mogura', 'onigiri', 'bakudan',
];
const HOLES_IMG_SRC = [
    './img/none.png', './img/mogura.png',
    './img/onigiri.png', './img/bakudan.png',
    './img/mogura-after.png', './img/onigiri-after.png',
]

class Board {
    GAME_LEVEL = {
        // remainTime, swapInterval, appearance rate
        elementary: [15, 1200, [0, 0, 0, 0, 0, 1, 1, 1, 2, 3]],
        intermediate: [15, 650,
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3]],
        advanced: [10, 400, [0, 0, 0, 0, 0, 1, 1, 2, 3, 3]],
        test: [20, 1200, [0, 0, 1, 1,]],
    };
    constructor(tableId, timerId, hitsId, logsListId, toResultViewId, gameLevel = "elementary") {
        this.TABLE_ELEM = document.getElementById(tableId);
        this.timerElem = document.getElementById(timerId);
        this.hitsElems = document.getElementsByClassName(hitsId);
        this.logsListElem = document.getElementById(logsListId);
        this.toResultViewElem = document.getElementById(toResultViewId);

        this.holes = new Array();
        this.gameLevel = gameLevel;
        this.remainTime = 0;

        this.clickCount = new Array(9).fill(0);
        this.clickValidCount = new Array(9).fill(0);
        this.hitsCount = 0;
        this.onigiriCount = 0;

        this.#setHoles();

        //this.setGameLevel('advanced');
    }

    #setHoles() {
        const HOLES_ELEM = this.TABLE_ELEM.getElementsByTagName('img');
        for (let i = 0; i < HOLES_ELEM.length; i++) {
            const HOLE = new Hole(HOLES_ELEM[i], 0);
            this.holes.push(HOLE);

            HOLE.IMG_ELEM.addEventListener('click', () => {
                if (0 < this.remainTime) {
                    this.clickCount[i] ++;
                    let isNothole = HOLE.hit();
                    if (isNothole) {
                        this.clickValidCount[i] ++;
                        this.hitsEvent(isNothole);
                    }
                }
            });
        }
    }

    setGameLevel(gameLevel) {
        this.gameLevel = gameLevel;
    }

    hitsEvent(id) {
        if (id == 1) {
            this.hitsCount++;
            for (let i = 0; i < this.hitsElems.length; i++) {
                this.hitsElems[i].innerText = this.hitsCount;
            }
            this.appendLog('Mogura !!');
        } else if (id == 2) {
            this.onigiriCount++;
            this.remainTime += 3;
            this.appendLog('おにぎり 3秒追加 !');
        } else if (id == 3) {
            clearInterval(this.swap);
            this.remainTime = -999;
            this.appendLog('ばくだん !!!!');
            setTimeout(() => {
                this.TABLE_ELEM.style.backgroundColor = "red";
                this.logsListElem.parentElement.style.backgroundColor = "red";
            }, 1000);
        }
    }

    gameStart() {
        let gameStatus = this.GAME_LEVEL[this.gameLevel];
        this.remainTime = gameStatus[0];
        this.swapInterval = gameStatus[1];
        this.appearRate = gameStatus[2];
        this.totalTime = 0;

        this.timerElem.innerText = this.remainTime;
        this.logsListElem.innerHTML = "";
        this.appendLog("Game Start !!");

        this.timer = setInterval(() => {
            this.remainTime--;
            if (this.remainTime < 0) this.remainTime = 0;
            this.timerElem.innerText = this.remainTime;

            if (0 < this.remainTime) {
                this.totalTime++;
                if ((this.totalTime % 10) == 0) {
                    clearInterval(this.swap);
                    this.swapInterval -= 40;
                    if (this.swapInterval < 100) this.swapInterval = 100;
                    console.log(this.swapInterval);
                    this.swap = setInterval(() => {
                        this.swapHoles()
                    }, this.swapInterval);
                }
            } else {
                clearInterval(this.timer);
                clearInterval(this.swap);
                this.appendLog('Finish !!');
                this.toResultViewElem.disabled = false;
            }

            this.timerElem.style.color = (5 < this.remainTime) ? "black" : "red";

        }, 1000);

        this.swap = setInterval(() => {
            this.swapHoles()
        }, this.swapInterval);
    }

    swapHoles() {
        const getId = (rate) => rate[Math.floor(Math.random() * rate.length)];

        for (let i in this.holes) {
            this.holes[i].setImg(getId(this.appearRate));
        }
    }

    appendLog(text) {
        let logElem = document.createElement('li');
        logElem.className = "list-group-item logContent";
        logElem.innerText = text;

        this.logsListElem.appendChild(logElem);
        this.logsListElem.parentElement.scrollTop = this.logsListElem.parentElement.scrollHeight
    }
}

class Hole {
    constructor(elem, id) {
        this.IMG_ELEM = elem;
        this.id = id;

        this.setImg(this.id);
    }

    setImg(id) {
        if (!this.id) {
            if (id) {
                this.IMG_ELEM.src = HOLES_IMG_SRC[id];
                this.id = id;
                anime({
                    targets: this.IMG_ELEM,
                    translateY: {
                        value: [160, 0],
                        easing: 'easeInOutQuad',
                        duration: 80,
                    },
                    opacity: 1
                });
            }
        } else {
            if (!id) {
                this.IMG_ELEM.src = HOLES_IMG_SRC[id];
                this.id = id;
                anime({
                    targets: this.IMG_ELEM,
                    translateY: {
                        value: [0, 160],
                        easing: 'easeInOutQuad',
                        duration: 80,
                    },
                    opacity: 0,
                });
            }
        }
    }

    hit() {
        let hitId = this.id;
        if (hitId == 1) {
            this.IMG_ELEM.src = HOLES_IMG_SRC[4];
            setTimeout(() => {
                this.setImg(0);
            }, 200);
        } else if (hitId == 2) {
            this.IMG_ELEM.src = HOLES_IMG_SRC[5];
            setTimeout(() => {
                this.setImg(0);
            }, 200);
        } else if (hitId == 3) {
            anime({
                targets: this.IMG_ELEM,
                rotate: {
                    value: [1800, -1800],
                    easing: 'easeInOutQuad'
                },
                duration: 1000,
                complete: () => {
                    this.setImg(0);
                }
            })
        } else {
            this.setImg(0);
        }
        return hitId;
    }
}