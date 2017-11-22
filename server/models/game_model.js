/**
 * @author Lukasz Lach
 */

const Observer = require('./../../core/observer');

//private variables declaration
const players = Symbol();
const activePlayer = Symbol();
const gameBoard = Symbol();
const currentlyHighlightedCell = Symbol();
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
        /**
         * @private
         * @type {null|{x: number, y: number}}
         */
        this[currentlyHighlightedCell] = null;
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
    /**
     * Resets currently highlighted cell by setting it to null.
     */
    resetCurrentlyHighlightedCell(){

        this[currentlyHighlightedCell] = null;
    }
    /**
     * Sets currently highlighted cell on game board coordinates.
     * @param {number}  x
     * @param {number}  y
     */
    setCurrentlyHighlightedCell(x, y){

        this[currentlyHighlightedCell] = {x: x, y: y};
    }
    /**
     * Returns currently highlighted cell on board (if no cell is highlighted, returns null).
     * @returns {*|{x: number, y: number}}
     */
    getCurrentlyHighlightedCell(){

        return this[currentlyHighlightedCell];
    }
}

module.exports = GameModel;