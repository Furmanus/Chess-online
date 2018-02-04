/**
 * @author Lukasz Lach
 */

const boardControllerClass = require('./board_controller');
const Observer = require('./../../core/observer');
const DatabaseConnection = require('./../helper/database');
const BoardHelper = require('./../helper/board_helper');
const EventEnums = require('./../../enums/events');
const GameManager = require('../managers/game_manager');

//private variables declaration
const boardController = Symbol();
const databaseConnection = Symbol();

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
        /**@type {DatabaseConnection}*/
        this[databaseConnection] = new DatabaseConnection();
        /**@type {BoardController}*/
        this[boardController] = new boardControllerClass(this[databaseConnection]);
    }
    /*
    --------------------------GAME BOARD METHODS---------------------------------------
     */
    /**
     * Method responsible registering temporary game and player data. Whenever player logs into game, game data is logged into games map. Each map key is equal to game id, and value
     * is object, which keys are equal to user names and values are equal to those users sockets Id.
     * @param {string}  gameId
     * @param {Object}  playerData
     * @param {string}  playerData.user
     * @param {string}  playerData.socketId
     * @param {string}  playerData.colour
     */
    registerTemporaryPlayerInGameData(gameId, playerData){

        GameManager.addUserToGame(gameId, playerData);
    }
    /**
     * Method responsible for removing user from temporary game and player data.
     * @param {string}  socketId    Unique socket id of client who left page.
     */
    removeUserFromTemporaryPlayerInGameData(socketId){

        const disconnectedUserData = GameManager.removeUserFromGame(socketId);

        this.notify(EventEnums.CLIENT_DISCONNECTED, disconnectedUserData);
    }
    /**
     * Method responsible for getting users currently logged in certain game.
     * @param {string}  gameId
     * @returns {Object}    Returns object containing information about players logged in game (key - socket id, value - user name)
     */
    getUserLoggedInGame(gameId){

        return GameManager.getUsersLoggedInGame(gameId);
    }
    /**
     * Method responsible for returning promise with game data.
     * @param {string}  gameId  Unique game id from database.
     * @returns {Promise}
     */
    getGameDataByIdPromise(gameId){

        return this.getBoardController().getGameDataByIdPromise(gameId);
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

        return this.getBoardController().moveFigure(data);
    }
    /**
     * Method responsible for storing message from game page in database.
     * @param {string}  gameId
     * @param {string}  message
     * @param {Object}  moveData
     */
    storeMessageInDatabase(gameId, message, moveData){

        return this.getDatabaseConnection().addMessageToGame(gameId, message, moveData);
    }
    /**
     * Method responsible for getting messages for certain game from database.
     * @param {string}  gameId
     */
    getMessagesFromDatabase(gameId){

        return this.getDatabaseConnection().getGameDataById(gameId);
    }
    /**
     * Method responsible for changing status of certain game in database to ended"
     * @param gameId
     * @returns {Promise}
     */
    endGame(gameId){

        return this.getDatabaseConnection().endGame(gameId);
    }

    /*
     -------------------------LOGIN, DASHBOARD PAGES METHODS----------------------------
     */

    /**
     * Method responsible for creating new game in database.
     * @param {string}  userName
     * @returns {Promise}   Returns promise. Resolved promise contains information about created document in database.
     */
    createNewGame(username){

        const initialBoardData = BoardHelper.createInitialGameData();

        return this.getDatabaseConnection().insertNewGame(username, initialBoardData);
    }
    /**
     * Method responsible for adding new game information (its unique id) to certain user game list array in database.
     * @param {string}  username    Name of user
     * @param {string}  id          Game ID from database
     * @returns {Promise}
     */
    addGameToUser(username, id){

        return this.getDatabaseConnection().addGameToUserGames(username, id);
    }
    /**
     * Method responsible for fetching user data from database.
     * @param {string}      username    Name of user.
     * @returns {Promise}               Returns a promise. Fulfilled promise contains data about found user (or returns empty array if no user was found).
     */
    getUserDataFromDatabase(username){

        return this.getDatabaseConnection().findUserByName(username);
    }
    /**
     * Method responsible for registering user in database.
     * @param {string}          username    Name of user.
     * @param {string}          password    User password.
     * @returns {Promise<T>}                Returns a promise.
     */
    registerUserInDatabase(username, password){

        return this.getDatabaseConnection().insertNewUser(username, password);
    }
    /**
     * Method responsible for getting all registered active games from database.
     * @returns {Promise<any>}
     */
    getAllGamesData(){

        return this.getDatabaseConnection().getAllGamesData();
    }
    /**
     * Method responsible for joining black player to game.
     * @param {string}  gameId          Game ID from database.
     * @param {string}  blackPlayer     Name of player.
     * @returns {Promise}
     */
    joinBlackPlayerToGame(gameId, blackPlayer){

        return this.getDatabaseConnection().changeBlackPlayerNameInGame(gameId, blackPlayer);
    }
    /**
     * Method which for given user login makes query to database for that login. Returns promise, which resolved returns user data from database.
     * @param {string}  userLogin
     * @returns {Promise<T>}
     */
    getDatabaseUserDataPromise(userLogin){

        return this.getDatabaseConnection().findUserByName(userLogin);
    }
    /**
     * Returns board controller.
     * @returns {BoardController}
     */
    getBoardController(){

        return this[boardController];
    }
    /**
     * Returns database connection object.
     * @returns {DatabaseConnection}
     */
    getDatabaseConnection(){

        return this[databaseConnection];
    }
    /**
     * Returns temporary games data map.
     * @returns {Object}
     */
    getTemporaryGamesData(){

        return this[temporaryGamesData];
    }
}

module.exports = MainController;