/**
 * @author Lukasz Lach
 */

const Observer = require('./../../core/observer');

//private variables declaration
const players = Symbol();
const activePlayer = Symbol();
const gameBoard = Symbol();
/**
 * @class
 * @typedef {Object} GameModel
 */
class GameModel extends Observer{
    /**
     * @constructor
     */
    constructor(){

        super();
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
    }
    /**
     * Sets active player.
     * @param {string|undefined} playerColour
     */
    setActivePlayer(playerColour){

        this[activePlayer] = playerColour;
    }
    /**
     * Returns active player colour.
     * @returns {string|undefined}
     */
    getActivePlayer(){

        return this[activePlayer];
    }
}

module.exports = GameModel;