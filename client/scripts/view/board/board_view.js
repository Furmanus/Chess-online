/**@author Lukasz Lach*/

import Cell from "./cell";
import Figure from "./figure";
import FigureEnums from "../../enums/figures";
import ColourEnums from "../../enums/colours";
import HighlightEnums from "../../enums/highlight";
import Observer from "../../core/observer";
import EventEnums from "../../enums/events";

// private variables declaration
const gameBoard = Symbol('gameBoard');
const cells = Symbol('cells');

/**
 * @class
 * @typedef {Object} BoardView
 */
class BoardView extends Observer{

    /**
     * Constructor of game board view.
     * @constructor
     */
    constructor(){

        super();
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
        this.attachEventListeners();

        let d = new Figure(FigureEnums.KING, ColourEnums.WHITE, this.getCell(1, 1).getElement());

        let z = new Figure(FigureEnums.QUEEN, ColourEnums.BLACK, this.getCell(5, 6).getElement());

        //d.moveTo(this.getCell(5, 6));
    }

    /**
     * Attaches event listeners to game board.
     */
    attachEventListeners(){

        this.getGameBoard().addEventListener('click', this.clickEventListener.bind(this));
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

    /**
     * Event listener attached to game board.
     * @param {Event}   ev  Event object.
     */
    clickEventListener(ev){
        //we listen only on cell (so div elements)
        if(ev.target.tagName !== 'DIV'){

            return;
        }

        //if chosen cell contains figure, we need to take its parent element. Div element with figure is nested inside div element representing board cell.
        let selectedCell = ev.target.classList.contains('figure') ? ev.target.parentElement : ev.target;

        const coordinates = this.convertStringCoordinatesToObject(selectedCell.dataset.coordinates);
        this.notify(EventEnums.BOARD_CLICK, coordinates);
    }

    /**
     * Method responsible for toggling cell highlight.
     * @param   {number}    x   Row(horizontal) coordinate of chosen cell.
     * @param   {number}    y   Column(vertical) coordinate of chosen cell.
     */
    toogleCellHighlight(x, y){

        const targetCell = this.getCell(x, y);

        if (!targetCell.isHighlighted) {

            targetCell.highlightCell(HighlightEnums.RED);
        } else {

            targetCell.removeHighlightCell();
        }
    }

    /**
     * Method which converts string with coordinates into object with 'x' and 'y' properties.
     * @param   {string}                    String with cell coordinates. Example '2x1'.
     * @returns {{x: number, y: number}}    Object with cell coordinates.
     */
    convertStringCoordinatesToObject(string){

        if(string.length !== 3){

            throw new Error('Invalid string coordinates type.');
        }

        const x = parseInt(string.charAt(0));
        const y = parseInt(string.charAt(2));

        return {x: x, y: y};
    }
}

export default BoardView;