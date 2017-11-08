/**@author Lukasz Lach*/

import HighlightEnums from "../enums/highlight";
import Ajax from "../helper/ajax";
import Observer from "../core/observer";
import EventEnums from "../enums/events";

// declaration of private variables
const boardView = Symbol();
const socketClientManager = Symbol();

/**
 * Controller responsible for taking user input from game board, passing it to model and manipulating view.
 * @class
 * @typedef {Object}    BoardController
 */
class BoardController extends Observer{

    /**
     * Constructor for board controller.
     * @param {BoardView}           boardViewObject
     * @param {SocketClientManager} socketClientManagerInstance
     */
    constructor(boardViewObject, socketClientManagerInstance){

        super();

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
     * Method responsible for attaching event listeners.
     * @returns {undefined}
     */
    attachEventListeners(){

        this.listenToViewEvents();
    }

    /**
     * Method responsible for listening on board view for particular events.
     * @returns {undefined}
     */
    listenToViewEvents(){

        this.getBoardView().on(this, EventEnums.BOARD_CLICK, this.onBoardCellClick.bind(this));
    }

    /**
     *  //TODO pobranie elementu zrobione, dokończyć resztę po zrobieniu modelu
     * @param   {Object}    data    Object containing coordinates of chosen cell.
     * @param   {number}    data.x  Row(horizontal) coordinate of chosen cell.
     * @param   {number}    data.y  Column(vertical) coordinate of chosen cell.
     */
    onBoardCellClick(data){

        //TODO wysłać dane do servera i po odpowiedzi zaktualizować widok
        //this.getBoardView().toogleCellHighlight(data.x, data.y);
    }

    /**
     * Returns BoardView object.
     * @returns {BoardView} Returns BoardView object.
     */
    getBoardView(){

        return this[boardView];
    }
}

export default BoardController;