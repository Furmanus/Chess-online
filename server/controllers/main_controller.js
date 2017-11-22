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
        /**
         * @private
         * @type {BoardController}
         */
        this[boardController] = new boardControllerClass();
        /**
         * @private
         * @type {GameModel}
         */
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
     * @returns {undefined}
     */
    toggleActivePlayer(){

        const currentActivePlayer = this.getGameModel().getActivePlayer();

        this.getGameModel().setActivePlayer(currentActivePlayer === ColourEnums.WHITE ? ColourEnums.BLACK : ColourEnums.WHITE);
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
    getFigureMoves(coordinates){

        return this.getBoardController().getFigurePossibleMoves(coordinates);
    }
    /**
     * Method responsible for obtaining and returning object containg state of game board.
     * @return {Object}
     */
    getBoardState(){

        return this.getBoardController().getBoardState();
    }
}

module.exports = MainController;