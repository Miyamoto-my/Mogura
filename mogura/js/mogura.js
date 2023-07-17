
class Board {
    constructor() {
        this.rows = 3;
        this.columns = 3;
        
        this.board_state = new Array(this.rows).fill(0).map(() => new Array(this.columns).fill(null));
        this.#createNewBoard()
    }

    #createNewBoard() {
        for (let i = 0; i < this.rows; i++) {
            const ROW = document.createElement('tr');
            ROW.classList.add('board_row');
            for (let j = 0; j < this.columns; j++) {
                const MOGURA = new Mogura();
                ROW.appendChild(MOGURA.ELEM);
                this.board_state[i][j] = MOGURA;
            }
        }
        
    }
}

class Mogura {
    constructor(state = 'hole') {
        this.ELEM = document.createElement('td');
        this.state = state;
        
        this.#createMogura();
    }
    
    #createMogura() {
        this.imgElement = document.createElement('img');
        this.imgElement.src = `./img/${this.state}.png`;
        this.imgElement.alt = 'mogura_img';
        this.imgElement.classList.add('mogura_img');
        this.ELEM.appendChild(this.imgElement);
    }

    changeState(state) {
        this.state = state;
        this.imgElement.src = `./img/${state}.png`;
    }
}

console.log(new Board());