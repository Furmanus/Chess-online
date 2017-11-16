/**
 * @author Lukasz Lach
 */

const GameBoardModel = require('./../models/gameboard_model');
const Observer = require('./../../core/observer');

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
}

module.exports = BoardController;