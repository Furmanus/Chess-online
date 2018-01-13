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
     * Method responsible for actualization of database when player moves his figure.
     * @param {Object}  data                    Object with information about movement and game
     * @param {number}  data.sourceX            Horizontal coordinate of source cell
     * @param {number}  data.sourceY            Vertical coordinate of source cell
     * @param {number}  data.targetX            Horizontal coordinate of target cell
     * @param {number}  data.targetY            Vertical coordinate of target cell
     * @param {string}  data.gameId             Unique game id from database
     * @param {string}  data.user               User name which made move
     * @param {string}  data.colour             Colour of player that made his move
     */
    playerMoveEventListener(data){

        let updatedData;

        this.getMainController().moveFigure(data).then(function(databaseData){

            updatedData = Object.assign(databaseData, {

                sourceX: data.sourceX,
                sourceY: data.sourceY,
                targetX: data.targetX,
                targetY: data.targetY
            });

            this.emitEventToAll(EventEnums.PLAYER_MOVED, updatedData);
        }.bind(this)).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Callback function triggered after successful client socket connection.
     * @param socket
     */
    connectionEventListener(socket){

        socket.on('disconnect', function(){

            eventEmmiter.emit(EventEnums.CLIENT_DISCONNECTED, {socketId: socket.id});
        });
        socket.on(EventEnums.SEND_PLAYER_MOVE, this.playerMoveEventListener.bind(this));
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