/**
 * @author Lukasz Lach
 */

const userName = Symbol();
const playerColour = Symbol();
const gameId = Symbol();
const activePlayer = Symbol();

/**
 * @constructor
 * @typedef {Object} GameModel
 */
class GameModel{

    constructor(initialGameData){
        /**@type {string}*/
        this[userName] = initialGameData.user;
        /**@type {string}*/
        this[gameId] = initialGameData.id;
        /**@type {string}*/
        this[playerColour];
        /**@type {string}*/
        this[activePlayer];
    }
    /**
     * Returns player colour.
     * @returns {string}
     */
    getPlayerColour(){
        return this[playerColour];
    }
    /**
     * Sets player colour.
     * @param {string} colour
     * @returns {GameModel} Returns game model for chaining purposes.
     */
    setPlayerColour(colour){

        this[playerColour] = colour;
        return this;
    }
    /**
     * Returns game id.
     * @returns {string}
     */
    getGameId(){

        return this[gameId];
    }
    /**
     * Returns user name.
     * @returns {string}
     */
    getUserName(){

        return this[userName];
    }
    /**
     * Returns active player name.
     * @returns {string}
     */
    getActivePlayer(){

        return this[activePlayer];
    }
    /**
     * Sets active player colour.
     * @param {string}  playerColour
     */
    setActivePlayer(playerColour){

        this[activePlayer] = playerColour;
    }
}

export default GameModel;