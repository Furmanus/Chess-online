/**
 * @author Lukasz Lach
 */

const boardControllerClass = require('./board_controller');
const serverClass = require('../server');
const GameModel = require('./../models/game_model');
const Observer = require('./../../core/observer');
const ColourEnums = require('./../../enums/colours');

//private variables declaration
const boardController = Symbol();
const server = Symbol();
const socketManager = Symbol();
const gameModel = Symbol();

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
        /**
         * @private
         * @type {BoardController}
         */
        this[boardController] = new boardControllerClass();
        /**
         * @private
         * @type {Server}
         */
        this[server] = new serverClass();
        /**
         * @private
         * @type {SocketManager}
         */
        this[socketManager] = this.getServer().getSocketManager();
        /**
         * @private
         * @type {GameModel}
         */
        this[gameModel] = new GameModel();
    }

    /**
     * Returns board controller.
     * @returns {BoardController}
     */
    getBoardController(){

        return this[boardController];
    }

    /**
     * Returns routes object.
     * @returns {Server}
     */
    getServer(){

        return this[server];
    }

    /**
     * Returns SocketManager object.
     * @returns {SocketManager}
     */
    getSockerManager(){

        return this[socketManager];
    }
    /**
     * Returns game model.
     * @returns {GameModel}
     */
    getGameModel(){

        return this[gameModel];
    }
    /**
     * Changes active player in game model.
     * @returns {undefined}
     */
    toggleActivePlayer(){

        const currentActivePlayer = this.getGameModel().getActivePlayer();

        this.getGameModel().setActivePlayer(currentActivePlayer === ColourEnums.WHITE ? ColourEnums.BLACK : ColourEnums.WHITE);
    }

    /**
     * Sets active player in game model.
     * @param {string} playerColour
     */
    setActivePlayer(playerColour){

        if(!Object.values(ColourEnums).includes(playerColour)){

            throw new Error('Player color has to be either black or white.')
        }

        this.getGameModel().setActivePlayer(playerColour);
    }
}

module.exports = MainController;