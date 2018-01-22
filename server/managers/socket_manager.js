/**
 * @author Lukasz Lach
 */

const EventEnums = require('./../../enums/events');
const eventEmmiter = require('./../helper/event_emmiter');
const gameManager = require('./game_manager');

const socketIo = Symbol();
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

        this.getMainController().on(this, EventEnums.CLIENT_DISCONNECTED, this.onMainControllerRemovePlayerFromTemporaryGameData.bind(this));
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

            this.emitEventToClientsInGame(data.gameId, EventEnums.PLAYER_MOVED, updatedData);
        }.bind(this)).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Method responsible for sending to all connected client information about player login to game board page.
     * @param {Object}  data    Data received from client who just logged to game board page.
     */
    onPlayerGameBoardLogin(data){

        this.getMainController().registerTemporaryPlayerInGameData(data.gameId, {

            user: data.user,
            socketId: data.socketId,
            colour: data.colour
        });
        this.emitEventToClientsInGame(data.gameId, EventEnums.SERVER_PLAYER_LOGIN, data);
    }
    /**
     * Callback method called after main controller notifies socket manager that user was removed from temporary game data.
     * @param {Object}  data
     * @param {string}  data.user
     * @param {string}  data.colour
     * @param {string}  data.socketId
     */
    onMainControllerRemovePlayerFromTemporaryGameData(data){

        const socketId = data.socketId;

        delete data.socketId;
        this.emitEventToSpecifiedClient(socketId, EventEnums.SERVER_PLAYER_DISCONNECTED, data);
    }
    /**
     * Callback function triggered after successful client socket connection.
     * @param socket
     */
    connectionEventListener(socket){

        socket.on('disconnect', function(){

            this.getMainController().removeUserFromTemporaryPlayerInGameData(socket.id);
            eventEmmiter.emit(EventEnums.CLIENT_DISCONNECTED, {socketId: socket.id});
        }.bind(this));
        socket.on(EventEnums.SEND_PLAYER_MOVE, this.playerMoveEventListener.bind(this));
        socket.on(EventEnums.SEND_PLAYER_LOGIN, this.onPlayerGameBoardLogin.bind(this));
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

        if(!this.getSocketIo().sockets.connected[clientId]){

            console.warn('Invalid socket id');
            return;
        }

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
    /**
     * Method responsible for emiting event to clients logged to game of specified game id.
     * @param {string}  gameId
     * @param {string}  eventType
     * @param {Object}  data
     */
    emitEventToClientsInGame(gameId, eventType, data = {}){

        const usersInGame = gameManager.getUsersLoggedInGame(gameId);

        for(let userId in usersInGame){

            if(!usersInGame.hasOwnProperty(userId)){

                continue;
            }

            this.emitEventToSpecifiedClient(userId, eventType, data);
        }
    }
}

module.exports = SocketManager;