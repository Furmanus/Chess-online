/**
 * @author Lukasz Lach
 */

const EventEnums = require('./../../enums/events');
const eventEmmiter = require('./../helper/event_emmiter');

const socketIo = Symbol();
const clients = Symbol();
const mainController = Symbol();

/**
 * Class responsible for managing sockets from routes side.
 * @class
 * @typedef {Object}    SocketManager
 */
class SocketManager{

    /**
     * Constructor for SockerManager class. Creates instance of socket.io object attached to http routes.
     * @constructor
     * @param   {Object}            server  Instance of http routes (taken from 'require('http').Server(app), where app is express object instance).
     * @param   {Object}            socket  Instance of socketIo object (taken from 'require('socket.io').
     * @param   {MainController}    mainControllerObject    Instance of main game controller object.
     */
    constructor(server, socket, mainControllerObject){

        this[socketIo] = socket(server);
        /**@type {MainController*/
        this[mainController] = mainControllerObject;

        this.connectionEventListener = this.connectionEventListener.bind(this);

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

        this.listenOnEvent('connection', this.connectionEventListener);
    }
    /**
     * Callback function triggered after successful client socket connection.
     * @param socket
     */
    connectionEventListener(socket){

        //const playerColour = this.getMainController().getInitialPlayerData(socket.id);

        socket.on('disconnect', function(){

            eventEmmiter.emit(EventEnums.CLIENT_DISCONNECTED, {socketId: socket.id});
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
     * Returns instance of socket.io object attached to http routes.
     * @returns {Object}
     */
    getSocketIo(){

        return this[socketIo];
    }
    /**
     * Returns main game controller.
     * @returns {MainController}
     */
    getMainController(){

        return this[mainController];
    }
    /**
     * Method responsible for emmiting event when one player successfully moved one of his figures.
     * @param {Object}                  data                Additional data to pass to client.
     * @param {string}                  data.newPlayer      Currently active player(AFTER this move).
     * @param {{x: number, y: number}}  data.sourceCoords   Source coordinates of moved figure.
     * @param {{x: number, y: number}}  data.targetCoords   Target coordinates of moved figure.
     */
    emitMoveEventToAll(data){

        this.emitEventToAll(EventEnums.PLAYER_MOVED, data);
    }
    /**
     * Method responsible for emmiting event to specific client socket.
     * @param {string}      clientId    Id of socket to which we want to emit event
     * @param {string}      eventType   Name of event
     * @param {Object}      data        Additional data to send with event.
     */
    emitEventToSpecifiedClient(clientId, eventType, data = {}){

        this.getSocketIo().sockets.connected[clientId].emit(eventType, data);
    }
    /**
     * Method responsible for emmiting events to all connected sockets (including the sender)
     * @param {string}      eventType   Name of event
     * @param {Object}      data        Additional data to send with event.
     */
    emitEventToAll(eventType, data = {}){

        this.getSocketIo().sockets.emit(eventType, data);
    }
}

module.exports = SocketManager;