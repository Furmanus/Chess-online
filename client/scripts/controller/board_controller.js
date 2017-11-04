/**@author Lukasz Lach*/

import HighlightEnums from "../enums/highlight";
import Ajax from "../helper/ajax";

// declaration of private variables
const boardView = Symbol();
const socketClientManager = Symbol();

/**
 * Controller responsible for taking user input from game board, passing it to model and manipulating view.
 * @class
 * @typedef {Object}    BoardController
 */
class BoardController{

    /**
     * Constructor for board controller.
     * @param {BoardView}           boardViewObject
     * @param {SocketClientManager} socketClientManagerInstance
     */
    constructor(boardViewObject, socketClientManagerInstance){

        /**
         * @type {BoardView}
         * @private
         */
        this[boardView] = boardViewObject;

        /**
         * @type {SocketClientManager}
         * @private
         */
        this[socketClientManager] = socketClientManagerInstance;

        this.attachEventListeners();
    }

    /**
     * Method responsible for attaching event listeners to various game board HTML elements.
     * @returns {undefined}
     */
    attachEventListeners(){

        this.attachClickEventListeners();
    }

    /**
     * Method responsible for attaching click event listeners to cells HTML elements.
     * @returns {undefined}
     */
    attachClickEventListeners(){

        const cellsMap = Array.from(this.getBoardView().getCells().values()); //we transform map to array;

        for(let cell of cellsMap){

            cell.getElement().addEventListener('click', this.clickEventListener.bind(this));
        }
    }

    /**
     *  //TODO pobranie elementu zrobione, dokończyć resztę po zrobieniu modelu
     * @param {Event}   ev                                      Event object which triggered this function.
     * @param {string}  ev.currentTarget.dataset.coordinates    String containing coordinates of chosen cell, stored in 'data-coordinates' HTML element attribute.
     */
    clickEventListener(ev){

        const targetCoordinates = this.convertStringCoordinatesToObject(ev.currentTarget.dataset.coordinates);
        const targetCell = this.getBoardView().getCell(targetCoordinates.x, targetCoordinates.y);

        if (!targetCell.isHighlighted) {

            targetCell.highlightCell(HighlightEnums.RED);
        } else {

            targetCell.removeHighlightCell();
        }
    }

    /**
     * Returns BoardView object.
     * @returns {BoardView} Returns BoardView object.
     */
    getBoardView(){

        return this[boardView];
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

export default BoardController;