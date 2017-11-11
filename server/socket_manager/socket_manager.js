/**
 * @author Lukasz Lach
 */
const Client = require('./../models/connected_client');

const socketIo = Symbol();
const clients = Symbol();

/**
 * Class responsible for managing sockets from server side.
 * @class
 * @typedef {Object}    SocketManager
 */
class SocketManager{

    /**
     * Constructor for SockerManager class. Creates instance of socket.io object attached to http server.
     * @constructor
     * @param   {Object}    server  Instance of http server (taken from 'require('http').Server(app), where app is express object instance).
     * @param   {Object}    socket  Instance of socketIo object (taken from 'require('socket.io').
     */
    constructor(server, socket){

        this[socketIo] = socket(server);
        this[clients] = new Map();

        this.initialize();
    }

    /**
     * Initializes work of SockerManager.
     */
    initialize(){

        this.attachEventListeners();
    }

    /**
     * Method responsible for attaching event handlers to some default events like 'connection', 'error', 'disconnection'
     */
    attachEventListeners(){

        this.getSocketIo().on('connection', function(socket){

            this.getClients().set(socket.id, new Client(socket, null));
        }.bind(this));
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
     * Returns instance of socket.io object attached to http server.
     * @returns {Object}
     */
    getSocketIo(){

        return this[socketIo];
    }

    /**
     * Returns Map object with connected sockets (key in map is equal to socket ID, values are data like socket, etc.)
     * @returns {Map}
     */
    getClients(){

        return this[clients];
    }
}

module.exports = SocketManager;