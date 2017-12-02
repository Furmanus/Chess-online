/**
 * @author Lukasz Lach
 */

const Observer = require('./../../core/observer');
const ColourEnums = require('./../../enums/colours');

//private variables declaration
const players = Symbol();
const activePlayer = Symbol();
const hasGameStarted = Symbol();
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
        /**@type {{white: {string|null}, black: {string|null}}*/
        this[players] = {

            white: null,
            black: null
        }
        /** @type {string|undefined}*/
        this[activePlayer] = ColourEnums.WHITE;
        /**@type {null|{x: number, y: number}}*/
        this[currentlyHighlightedCell] = null;
        /**@type {boolean}*/
        this[hasGameStarted] = false;
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
     * @returns {null|{x: number, y: number}}
     */
    getCurrentlyHighlightedCell(){

        return this[currentlyHighlightedCell];
    }
    /**
     * Returns object with players.
     * @param   {string}    id
     * @returns {string}
     */
    getPlayerColour(id){

        let playerColour = null;
        let opponentId = null;

        if(!this.getPlayersObject().white){

            this.getPlayersObject().white = id;
            playerColour = ColourEnums.WHITE;
        }else if(!this.getPlayersObject().black){

            this.getPlayersObject().black = id;
            playerColour = ColourEnums.BLACK;
            opponentId = this.getPlayersObject().white;
        }else{

            playerColour = '';
        }

        return {colour: playerColour, opponentId: opponentId, activePlayer: this.getActivePlayer()};
    }
    /**
     * Removes player from active players object.
     * @param {string}  id  Socket ID of player to remove.
     */
    removePlayer(id){

        if(this.getPlayersObject().white === id){

            this.getPlayersObject().white = null;
        }
        if(this.getPlayersObject().black === id){

            this.getPlayersObject().black = null;
        }
    }
    /**
     * Returns active player colour.
     * @returns {string|undefined}
     */
    getActivePlayer(){

        return this[activePlayer];
    }
    /**
     * Sets active player.
     * @param {string|undefined} playerColour
     */
    setActivePlayer(playerColour){

        this[activePlayer] = playerColour;
    }
    /**
     * Returns object with players white and black id numbers (or null if colours have not been taken)
     * @returns {Object}
     */
    getPlayersObject(){

        return this[players];
    }
    /**
     * Returns boolean variable indicating whether game is active (has started) or not.
     * @returns {boolean}
     */
    isGameActive(){

        return this[hasGameStarted];
    }
    /**
     * Method responsible for starting game.
     */
    startGame(){

        this[hasGameStarted] = true;
    }
}

module.exports = GameModel;