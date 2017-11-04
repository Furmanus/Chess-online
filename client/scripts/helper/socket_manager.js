/**
 * @author Lukasz Lach
 */

const socket = Symbol();

/**
 * Class responsible for managing socket connection from client side.
 * @class
 * @typedef {Object}    SocketClientManager
 */
class SocketClientManager{

    /**
     * @constructor
     */
    constructor(){

        this[socket] = undefined;

        this.initialize();
    }

    /**
     * Method responsible for initializing SocketClientManager class. Creates new socket connected to server.
     */
    initialize(){

        this[socket] = io();
    }
}

module.exports = SocketClientManager;