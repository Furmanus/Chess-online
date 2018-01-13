/**
 * @author Lukasz Lach
 */

const Observer = require('./../../core/observer');

const databaseConnection = Symbol();

/**
 * @class
 * @typedef {Object}    BoardController
 */
class BoardController extends Observer{
    /**
     * @constructor
     * @param {DatabaseConnection}  databaseConnectionObject    Object responsible for connecting to database.
     */
    constructor(databaseConnectionObject){

        super();
        /**@type {DatabaseConnection}*/
        this[databaseConnection] = databaseConnectionObject;
    }
    /**
     * Method responsible for returning promise with game data.
     * @param {string}  gameId  Unique game id from database.
     * @returns {Promise}
     */
    getGameDataByIdPromise(gameId){

        return this.getDatabaseConnection().getGameDataById(gameId);
    }
    /**
     * Returns database connection object.
     * @returns {DatabaseConnection}
     */
    getDatabaseConnection(){

        return this[databaseConnection];
    }
    /**
     * Method responsible for actualization of database when player moves his figure.
     * @param {Object}  data                    Object with information about movement and game
     * @param {number}  data.sourceX            Horizontal coordinate of source cell
     * @param {number}  data.sourceY            Vertical coordinate of source cell
     * @param {number}  data.targetX            Horizontal coordinate of target cell
     * @param {number}  data.targetY            Vertical coordinate of target cell
     * @param {string}  data.gameId             Unique game id from database
     * @param {string}  data.user               User name which made move
     * @param {string}  data.colour             Colour of player that made his move
     * @returns {Promise}
     */
    moveFigure(data){

        return this.getDatabaseConnection().registerPlayerMove(data.gameId, data.colour, data.sourceX, data.sourceY, data.targetX, data.targetY);
    }
}

module.exports = BoardController;