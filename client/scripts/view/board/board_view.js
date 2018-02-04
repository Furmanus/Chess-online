/**@author Lukasz Lach*/

import Cell from "./cell";
import Figure from "./figure";
import FigureEnums from "../../../../enums/figures";
import ColourEnums from "../../../../enums/colours";
import HighlightEnums from "../../../../enums/highlight";
import Observer from "../../../../core/observer";
import EventEnums from "../../../../enums/events";
import Growler from "../../helper/growler";

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

        this.clickEventListener = this.clickEventListener.bind(this);

        this.prepareGameBoard();
        this.attachEventListeners();
    }

    /**
     * Attaches event listeners to game board.
     */
    attachEventListeners(){

        this.getGameBoard().addEventListener('click', this.clickEventListener);
    }

    /**
     * Removes event listeners from game board.
     */
    detachEventListeners(){

        this.getGameBoard().removeEventListener('click', this.clickEventListener);
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
     * Method responsible for replaying certain move.
     * @param {Object}  moveData            Object with data about previous board state and move to replay
     * @param {Object}  currentBoardState   Object with serialized data of current board state
     */
    replayMove(moveData, currentBoardState){

        try {

            this.notify(EventEnums.BOARD_VIEW_REPLAY_START);
            this.clearBoard();
            this.setGameStateFromObject(moveData.boardState);
            this.detachEventListeners();
            this.moveFigure({
                x: moveData.sourceX,
                y: moveData.sourceY
            }, {
                x: moveData.targetX,
                y: moveData.targetY
            }).then(function () {

                this.notify(EventEnums.BOARD_VIEW_REPLAY_END);
                this.clearBoard();
                this.setGameStateFromObject(currentBoardState);
                this.attachEventListeners();
            }.bind(this));
        }catch(err){

            console.error(err);
            this.clearBoard();
            this.setGameStateFromObject(currentBoardState);
            new Growler('Error occured. Failed to load replay.');
        }
    }
    /**
     * Method responsible for clearing game board from figures.
     */
    clearBoard(){

        this.getCells().forEach(function(item){

            item.removeFigure();
        });
    }
    /**
     * Sets view of every cell from object.
     * @param {Object} gameState
     */
    setGameStateFromObject(gameState){

        let x;
        let y;
        let figure;
        let colour;
        let parentElement;

        for(let element in gameState){

            x = element[0];
            y = element[2];
            figure = gameState[element].figure;
            colour = gameState[element].colour;
            parentElement = this.getCells().get(`${x}x${y}`);

            if(figure){

                parentElement.setFigure(new Figure(figure, colour, parentElement.getElement()));
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
     * @param   {number}    x       Row(horizontal) coordinate of chosen cell.
     * @param   {number}    y       Column(vertical) coordinate of chosen cell.
     * @param   {string}    colour  Colour of cell border. Member of ColourEnums object.
     */
    highlightCell(x, y, colour){

        const targetCell = this.getCell(x, y);

        if (!targetCell.isHighlighted) {

            targetCell.highlightCell(colour);
        } else {

            targetCell.removeHighlightCell();
        }
    }
    /**
     * Highlights cells of possible moves of a figure. Cells coordinates are stored in array argument.
     * @param {{x: number, y: number}[]}    possibleMoves
     */
    highlightFigurePossibleMoves(possibleMoves){

        this.highlightArrayOfCells(possibleMoves, HighlightEnums.BLUE);
    }
    highlightSelectedFigure(x, y){

        this.highlightCell(x, y, HighlightEnums.RED);
    }
    /**
     * Highlights array of cells given as argument
     * @param {Array.{x: number, y: number}}    coordinates
     * @param {string}                          colour
     */
    highlightArrayOfCells(coordinates, colour){

        let examinedCell;

        for(let coordinate of coordinates){

            examinedCell = this.getCell(coordinate.x, coordinate.y);
            examinedCell.highlightCell(colour);
        }
    }
    /**
     * Removes highlight from every cell on board.
     */
    removeCellHighlightFromBoard(){

        const cellMap = this.getCells();

        cellMap.forEach(function(key, value){

            key.removeHighlightCell();
        })
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
    /**
     * Method initializing animation of moving figure from source cell to target cell.
     * @param   {{x: number, y: number}}  sourceCoords
     * @param   {{x: number, y: number}}  targetCoords
     * @returns {Promise}   Promise which resolves after animation is over.
     */
    moveFigure(sourceCoords, targetCoords){

        const sourceCell = this.getCell(sourceCoords.x, sourceCoords.y);
        const targetCell = this.getCell(targetCoords.x, targetCoords.y);

        return this.getCell(sourceCoords.x, sourceCoords.y).getFigure().moveTo(sourceCell, targetCell);
    }
}

export default BoardView;