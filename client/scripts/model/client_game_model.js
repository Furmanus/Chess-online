/**
 * @author Lukasz Lach
 */

const playerColour = Symbol();

/**
 * @constructor
 * @typedef {Object} GameModel
 */
class GameModel{

    constructor(){
        /**@type {string}*/
        this[playerColour] = undefined;
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
     */
    setPlayerColour(colour){
        this[playerColour] = colour;
    }
}

export default GameModel;