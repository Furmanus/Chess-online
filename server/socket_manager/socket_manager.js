/**
 * @author Lukasz Lach
 */

const socketIo = Symbol();

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

        this.initialize();
    }

    /**
     * Initializes work of SockerManager by listening on 'connection' event.
     */
    initialize(){

        this.getSocketIo().on('connection', function(socket){

            console.log('User connected');
        });
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
}

module.exports = SocketManager;