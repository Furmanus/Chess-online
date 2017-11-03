/**@author Lukasz Lach*/

import Cell from "./cell";
import Figure from "./figure";
import FigureEnums from "../../enums/figures";
import ColourEnums from "../../enums/colours";
import HighlightEnums from "../../enums/highlight";

// private variables declaration
const gameBoard = Symbol('gameBoard');
const cells = Symbol('cells');

/**
 * @class
 * @typedef {Object} BoardView
 */
class BoardView{

    /**
     * Constructor of game board view.
     * @constructor
     */
    constructor(){

        /**
         * @type {HTMLElement}
         * @private
         */
        this[gameBoard] = document.getElementById('board');

        /**
         * Holds created cells, where key is in form "<row>x<column". Under key is stored Cell object.
         * @private
         * @type {Map}
         */
        this[cells] = new Map();

        this.initialize();
    }

    /**
     * Initialization method for game board view.
     * @returns {undefined}
     */
    initialize(){

        this.prepareGameBoard();

        let d = new Figure(FigureEnums.KING, ColourEnums.WHITE, this.getCell(1, 1).getElement());

        let z = new Figure(FigureEnums.QUEEN, ColourEnums.BLACK, this.getCell(5, 6).getElement());

        //d.moveTo(this.getCell(5, 6));
    }

    /**
     * Fills game board with board cells.
     * @returns {undefined}
     */
    prepareGameBoard(){

        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){

                this.setCell(j, i, new Cell(j, i, this.getGameBoard()));
            }
        }
    }

    /**
     * Getter for HTML Element representing game board.
     * @returns {HTMLElement}
     */
    getGameBoard(){

        return this[gameBoard];
    }

    /**
     * Returns cell object from cells map.
     * @param {number} x Horizontal (row) coordinate.
     * @param {number} y Vertical (column) coordinate.
     * @returns {Cell} Returns cell object from cells map.
     */
    getCell(x, y){

        return this[cells].get(x + 'x' + y);
    }

    /**
     * Returns Map storing cells objects.
     * @returns {Map} Map storing cells objects.
     */
    getCells(){

        return this[cells];
    }

    /**
     * Stores new cell object in cells map.
     * @param x
     * @param y
     * @param cell
     */
    setCell(x, y, cell){

        this.getCells().set(x + 'x' + y, cell);
    }
}

export default BoardView;