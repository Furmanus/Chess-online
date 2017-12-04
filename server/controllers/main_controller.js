/**
 * @author Lukasz Lach
 */

const boardControllerClass = require('./board_controller');
const GameModel = require('./../models/game_model');
const Observer = require('./../../core/observer');
const ColourEnums = require('./../../enums/colours');

//private variables declaration
const boardController = Symbol();
const gameModel = Symbol();

/**
 * @class
 * @typedef {Object}    MainController
 */
class MainController extends Observer{
    /**
     * @constructor
     */
    constructor(){

        super();
        /**@type {BoardController}*/
        this[boardController] = new boardControllerClass();
        /**@type {GameModel}*/
        this[gameModel] = new GameModel();
    }
    /**
     * Returns board controller.
     * @returns {BoardController}
     */
    getBoardController(){

        return this[boardController];
    }
    /**
     * Returns game model.
     * @returns {GameModel}
     */
    getGameModel(){

        return this[gameModel];
    }
    /**
     * Changes active player in game model.
     * @returns {undefined|string}
     */
    toggleActivePlayer(){

        const currentActivePlayer = this.getGameModel().getActivePlayer();

        return this.getGameModel().setActivePlayer(currentActivePlayer === ColourEnums.WHITE ? ColourEnums.BLACK : ColourEnums.WHITE);
    }
    /**
     * Sets active player in game model.
     * @param {string} playerColour
     */
    setActivePlayer(playerColour){

        if(!Object.values(ColourEnums).includes(playerColour)){

            throw new Error('Player color has to be either black or white.')
        }

        this.getGameModel().setActivePlayer(playerColour);
    }
    /**
     * Returns colour of active player.
     * @returns {string|undefined}
     */
    getActivePlayer(){

        return this.getGameModel().getActivePlayer();
    }
    /**
     * Removes player from game model active players object.
     * @param {string}  id  Socket id of player to remove.
     */
    removePlayerFromGameModel(id){

        this.getGameModel().removePlayer(id);
    }
    /**
     * Returns currently highlighted cell coordinates or null if no cell was selected.
     * @returns {*|{x: number, y: number}}
     */
    getCurrentlyHighlightedCell(){

        return this.getGameModel().getCurrentlyHighlightedCell();
    }
    /**
     * Sets currently highlighted cell in game model.
     * @param {number}  x
     * @param {number}  y
     */
    setCurrentlyHighlightedCell(x, y){

        this.getGameModel().setCurrentlyHighlightedCell(x, y);
    }
    /**
     * Resets currently highlighted cell in game model by setting it to null.
     */
    resetCurrentlyHighlightedCell(){

        this.getGameModel().resetCurrentlyHighlightedCell();
    }
    /**
     * Returns array of figure possible moves coordinates.
     * @param {{x: number, y: number}}  coordinates
     * @param {string}                  colour
     * @returns {Array.{x: number, y: number}}
     */
    getFigureMoves(coordinates, colour){

        return this.getBoardController().getFigurePossibleMoves(coordinates, colour);
    }
    /**
     * Method responsible for obtaining and returning object containg state of game board.
     * @return {Object}
     */
    getBoardState(){

        return this.getBoardController().getBoardState();
    }
    /**
     * Gets initial player data from game model.
     * @param   {string}    id
     * @returns {{colour: string}}
     */
    getInitialPlayerData(id){

        return this.getGameModel().getPlayerColour(id);
    }
    setCurrentFigurePossibleMoves(possibleMoves){

        this.getBoardController().setCurrentFigurePossibleMoves(possibleMoves);
    }
    resetCurrentFigurePossibleMoves(){

        this.getBoardController().resetCurrentFigurePossibleMoves();
    }
    /**
     * Method responsible for checking whether move choosen by player is legal.
     * @param {{x: number, y: number}}  coordinates
     */
    checkIfChosenCoordinatesMeetsPossibleMoves(coordinates){

        return this.getBoardController().checkIfChosenCoordinatesMeetsPossibleMoves(coordinates);
    }
    moveFigure(sourceCoords, targetCoords){

        return this.getBoardController().moveFigure(sourceCoords, targetCoords);
    }
    getActivePlayerFiguresToMove(){

        const activePlayer = this.getActivePlayer();

        return this.getBoardController().getPlayerFiguresAbleToMove(activePlayer);
    }
    /**
     * Returns figure captured last turn from game board model.
     * @returns {string}
     */
    getFigureCapturedLastTurn(){

        return this.getBoardController().getFigureCapturedLastTurn();
    }
}

module.exports = MainController;