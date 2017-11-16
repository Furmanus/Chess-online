/**
 * @author Lukasz Lach
 */

const CellModel = require('./cell_model');
const FigureEnums = require('./../../enums/figures');
const ColourEnums = require('./../../enums/colours');
const Observer = require('./../../core/observer');

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

        for(let i=0; i<8; i++){

            for(let j=0; j<8; j++){

                if(i === 0 && j === 5){

                    this.getCells().set(`${j}x${i}`, new CellModel(FigureEnums.PAWN, ColourEnums.BLACK));
                }else {

                    this.getCells().set(`${j}x${i}`, new CellModel(null, null));
                }
            }
        }
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
