/**
 * @author Lukasz Lach
 */

const boardControllerClass = require('./board_controller');
const serverClass = require('./../server');

//private variables declaration
const boardController = Symbol();
const server = Symbol();
const socketManager = Symbol();

/**
 * @class
 * @typedef {Object}    MainController
 */
class MainController{

    /**
     * @constructor
     */
    constructor(){

        /**
         * @private
         * @type {BoardController}
         */
        this[boardController] = undefined;
        /**
         * @private
         * @type {Server}
         */
        this[server] = undefined;
        /**
         * @private
         * @type {SocketManager}
         */
        this[socketManager] = undefined;

        this.initialize();
    }

    initialize(){

        this[boardController] = new boardControllerClass();
        this[server] = new serverClass();
        this[socketManager] = this.getServer().getSocketManager();
    }

    /**
     * Returns board controller.
     * @returns {BoardController}
     */
    getBoardController(){

        return this[boardController];
    }

    /**
     * Returns server object.
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
}

module.exports = MainController;