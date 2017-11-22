/**@author Lukasz Lach*/

import HighlightEnums from "../../../enums/highlight";
import Ajax from "../helper/ajax";
import Observer from "../../../core/observer";
import EventEnums from "../../../enums/events";

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
        this.initialize();
    }

    /**
     * Method responsible for initialization of board controller.
     */
    initialize(){

        this.getBoardStateFromServer().then(function(boardData){

            this.setBoardStateInView(boardData);
        }.bind(this)).catch(function(reason){

            console.error(reason);
        }.bind(this));
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

        const self = this;

        Ajax.get('/figure_moves', data).then(function(response){

            if(response.action && response.action === 'reset'){

                self.getBoardView().removeCellHighlightFromBoard();
            }

            if(response.action && response.action === 'highlight') {

                self.getBoardView().highlightFigurePossibleMoves(response.data);
            }
        }).catch(function(error){

            console.log(error);
        })
    }
    /**
     * Returns BoardView object.
     * @returns {BoardView} Returns BoardView object.
     */
    getBoardView(){

        return this[boardView];
    }
    /**
     * Method responsible for fetching board state (state of every cell in board) from server. Returned object consist keys equal to board cells coordinates ('2x3' for example)
     * and values which are object with keys 'figure' and 'owner'.
     * @return {Promise}
     */
    getBoardStateFromServer(){

        return new Promise(function(resolve, reject){

            Ajax.get('/board_state', {}).then(function(data){

                resolve(data);
            }).catch(function(reason){

                reject(reason);
            });
        });
    }
    setBoardStateInView(boardState){

        this.getBoardView().setGameStateFromObject(boardState);
    }
}

export default BoardController;