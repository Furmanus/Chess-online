/**
 * @author Lukasz Lach
 */

const CellModel = require('./cell_model');
const FigureEnums = require('./../../enums/figures');
const ColourEnums = require('./../../enums/colours');
const Observer = require('./../../core/observer');
const Figure = require('./figures/figure');

const cells = Symbol();

/**
 * Class representing model of game board.
 * @class
 * @typedef {Object} GameBoardModel
 */
class GameBoardModel extends Observer{

    /**
     * @constructor
     */
    constructor(){

        super();
        /**
         * @private
         * @type {Map}
         */
        this[cells] = new Map();

        this.initialize();
    }

    /**
     * Method which initializes map with cells.
     */
    initialize(){

        let figureColour = null;

        for(let i=0; i<8; i++){

            for(let j=0; j<8; j++){

                if(j === 1 || j === 6){

                    this.setCell(i, j, new Figure(j === 0 ? ColourEnums.BLACK : ColourEnums.WHITE, FigureEnums.PAWN));
                }else if(j === 0 || j === 7){

                    figureColour = j === 0 ? ColourEnums.BLACK : ColourEnums.WHITE;

                    if(i === 0 || i === 7) {

                        this.setCell(i, j, new Figure(figureColour, FigureEnums.ROOK));
                    }else if(i === 1 || i === 6){

                        this.setCell(i, j, new Figure(figureColour, FigureEnums.KNIGHT))
                    }else if(i === 2 || i === 5){

                        this.setCell(i, j, new Figure(figureColour, FigureEnums.BISHOP));
                    }else if(i === 3){

                        this.setCell(i, j, new Figure(figureColour, FigureEnums.QUEEN));
                    }else if(i === 4){

                        this.setCell(i, j, new Figure(figureColour, FigureEnums.KING));
                    }
                } else {

                    this.setCell(i, j, null);
                }
            }
        }
    }
    setCell(x, y, figure){

        this.getCells().set(`${x}x${y}`, new CellModel(figure));
    }
    /**
     * Returns figure which is stored in certain cell (or null if no figure is present) and its owner.
     * @param  {{x: number, y: number}} cell
     * @return {{figure: (string|null), owner: (string|null)}}
     */
    getCellData(cell){

        const thisBoardModelInstance = this;

        return {

            figure: thisBoardModelInstance.getCells().get(`${cell.x}x${cell.y}`).getFigure(),
            owner: thisBoardModelInstance.getCells().get(`${cell.x}x${cell.y}`).getOwner()
        }
    }
    /**
     * Returns Map object containing board cells.
     * @returns {Map}
     */
    getCells(){

        return this[cells];
    }
}

module.exports = GameBoardModel;
