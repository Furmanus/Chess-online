/**
 * @author Lukasz Lach
 */

//private variables declaration
const socket = Symbol();
let instance;

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

        if(!instance){

            instance = this;

            this[socket] = undefined;
            this.initialize();
        }

        return instance;
    }

    /**
     * Method responsible for making socket listen to certain event.
     * @param   {string}    event       Event on which socket should listen.
     * @param   {function}  callback    Callback function triggered upon event emition.
     */
    listenOnEvent(event, callback){

        this.getSocketIo().on(event, callback);
    }

    /**
     * Callback function after successful socket connection to server.
     */
    onSocketConnection(){

        console.log(this[socket].id);
    }

    /**
     * Method responsible for initializing SocketClientManager class. Creates new socket connected to server.
     */
    initialize(){

        this[socket] = io();

        this[socket].on('connect', this.onSocketConnection.bind(this));
    }
}

module.exports = SocketClientManager;