/**
 * @author Lukasz Lach
 */

const GameBoardModel = require('gameboard_model');

//private variables declaration
const players = Symbol();
const activePlayer = Symbol();
const gameBoard = Symbol();

/**
 * @class
 * @typedef {Object} GameModel
 */
class GameModel{

    /**
     * @constructor
     */
    constructor(){

        /**
         * @private
         * @type {{white: {string|null}, black: {string|null}}
         */
        this[players] = {

            white: null,
            black: null
        }
        /**
         * @private
         * @type {string|undefined}
         */
        this[activePlayer] = undefined;
        /**
         * @private
         * @type {GameBoardModel}
         */
        this[gameBoard] = new GameBoardModel();
    }
}

module.exports = GameModel;