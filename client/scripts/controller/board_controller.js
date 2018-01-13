/**@author Lukasz Lach*/

import HighlightEnums from "../../../enums/highlight";
import Ajax from "../helper/ajax";
import Observer from "../../../core/observer";
import EventEnums from "../../../enums/events";
import BoardModel from "../model/board_model/board_model";

// declaration of private variables
const boardView = Symbol();
const socketClientManager = Symbol();
const gameModel = Symbol();
const boardModel = Symbol();

/**
 * Controller responsible for taking user input from game board, passing it to model and manipulating view.
 * @class
 * @typedef BoardController
 */
class BoardController extends Observer{
    /**
     * Constructor for board controller.
     * @param {BoardView}           boardViewObject
     * @param {SocketClientManager} socketClientManagerInstance
     * @param {GameModel}           gameModelObject
     */
    constructor(boardViewObject, socketClientManagerInstance, gameModelObject){

        super();

        /**@type {BoardView}*/
        this[boardView] = boardViewObject;
        /**@type {SocketClientManager}*/
        this[socketClientManager] = socketClientManagerInstance;
        /**@type {GameModel}*/
        this[gameModel] = gameModelObject;
        /**@type {BoardModel}*/
        this[boardModel] = new BoardModel();

        this.initialize();
    }

    /**
     * Method responsible for initialization of board controller.
     */
    initialize(){

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
     * Stops listening for notifications from view.
     */
    detachEventsInView(){

        this.getBoardView().off(this, EventEnums.BOARD_CLICK);
    }
    /**
     *  //TODO uzupełnic.
     * @param   {Object}    data    Object containing coordinates of chosen cell.
     * @param   {number}    data.x  Row(horizontal) coordinate of chosen cell.
     * @param   {number}    data.y  Column(vertical) coordinate of chosen cell.
     */
    onBoardCellClick(data){

        let currentlyHighlightedCell = this.getBoardModel().getCurrentlyHighlightedCell();
        const x = data.x;
        const y = data.y;
        let selectedFigurePossibleMoves;
        let isClickedCellMeetingHighlightedCells;
        let currentlyHighlightedCellCoordinates;
        let targetCellCoordinates;
        let moveData;
        const examinedCell = this.getBoardModel().getCell(x, y);

        if(!currentlyHighlightedCell){

            if(examinedCell.getFigure() && examinedCell.getFigure().getColour() === this.getGameModel().getPlayerColour()){

                selectedFigurePossibleMoves = this.getBoardModel().getFigurePossibleMoves(x, y);

                this.getBoardModel().setCurrentlyHighlightedCell(examinedCell);
                this.getBoardModel().setSelectedFigurePossibleMoves(selectedFigurePossibleMoves)
                this.getBoardView().highlightSelectedFigure(x, y);
                this.getBoardView().highlightFigurePossibleMoves(selectedFigurePossibleMoves);
            }
        }else{

            if(examinedCell === currentlyHighlightedCell){

                this.getBoardModel().setCurrentlyHighlightedCell(null);
                this.getBoardView().removeCellHighlightFromBoard();
            }else{

                isClickedCellMeetingHighlightedCells = this.getBoardModel().getSelectedFigurePossibleMoves().some(function(item){

                    if(item.x === x && item.y === y){

                        return true;
                    }
                });

                if(isClickedCellMeetingHighlightedCells){

                    currentlyHighlightedCellCoordinates = currentlyHighlightedCell.getCoordinates();
                    targetCellCoordinates = examinedCell.getCoordinates();
                    moveData = {

                        sourceX: currentlyHighlightedCellCoordinates.x,
                        sourceY: currentlyHighlightedCellCoordinates.y,
                        targetX: targetCellCoordinates.x,
                        targetY: targetCellCoordinates.y
                    };

                    this.detachEventsInView();
                    this.getBoardModel().markFigureAsMoved(currentlyHighlightedCellCoordinates.x, currentlyHighlightedCellCoordinates.y);
                    this.getBoardModel().setCurrentlyHighlightedCell(null);
                    this.getBoardModel().resetSelectedFigurePossibleMoves();
                    this.notifyMoveReadyToSend(moveData);
                }
            }
        }
    }
    notifyMoveReadyToSend(moveCoordinates){

        this.notify(EventEnums.MOVE_READY_TO_SEND_SERVER, moveCoordinates);
    }
    /**
     * Method responsible for fetching board state (state of every cell in board) from server. Returned object has keys equal to board cells coordinates ('2x3' for example)
     * and values which are object with keys 'figure' and 'owner'.
     * @return {Promise}
     */
    getBoardStateFromServer(){

        const gameId = this.getGameModel().getGameId();

        return new Promise(function(resolve, reject){

            Ajax.get('/board_state', {gameId}, true).then(function(data){

                Ajax.validateAjaxResponseRedirect(data);
                resolve(data);
            }).catch(function(reason){

                reject(reason);
            });
        });
    }
    /**
     * Build model of game board.
     * @param {Object}  boardData   Board data object. Keys are equal to cell coordinate (example "2x3"). Values consist information about cell.
     */
    buildBoardModel(boardData){

        this.getBoardModel().build(boardData);
    }
    setBoardStateInView(boardState){

        this.getBoardView().setGameStateFromObject(boardState);
    }
    moveFigure(sourceCoords, targetCoords){

        this.getBoardView().removeCellHighlightFromBoard();
        this.getBoardView().moveFigure(sourceCoords, targetCoords);
        return this.getBoardModel().moveFigure(sourceCoords.x, sourceCoords.y, targetCoords.x, targetCoords.y);
    }
    highlightFiguresAbleToMoveInView(figuresCoordinates){

        this.getBoardView().highlightFiguresAbleToMove(figuresCoordinates);
    }
    /**
     * Returns game model.
     * @returns {GameModel}
     */
    getGameModel(){

        return this[gameModel];
    }
    /**
     * Returns board model.
     * @returns {BoardModel}
     */
    getBoardModel(){

        return this[boardModel];
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