/**
 * @author Lukasz Lach
 */

const GameBoardModel = require('./../models/gameboard_model');
const Observer = require('./../../core/observer');
const calculateMoves = require('./../helper/moves_calculation');

const gameBoardModel = Symbol();

/**
 * @class
 * @typedef {Object}    BoardController
 */
class BoardController extends Observer{
    /**
     * @constructor
     */
    constructor(){

        super();
        /**
         * @private
         * @type {GameBoardModel}
         */
        this[gameBoardModel] = new GameBoardModel();
    }
    /**
     * Returns model of game board.
     * @returns {GameBoardModel}
     */
    getGameBoardModel(){

        return this[gameBoardModel];
    }
    getFigurePossibleMoves(coordinates){

        const figure = this.getGameBoardModel().getFigure(coordinates);
        const boardState = this.getBoardState();

        if(!figure){

            return {};
        }

        return calculateMoves(figure, coordinates, boardState);
    }
    getBoardState(){

        return this.getGameBoardModel().getDataToSerialization();
    }
}

module.exports = BoardController;