/**
 * @author Lukasz Lach
 */

import Observer from './../../../core/observer';
import EventEnums from './../../../enums/events';

//private variables declaration
const socket = Symbol();
let instance;

/**
 * Class responsible for managing socket connection from client side.
 * @class
 * @typedef {Object}    SocketClientManager
 */
class SocketClientManager extends Observer{

    /**
     * @constructor
     */
    constructor(){

        super();

        if(!instance){

            instance = this;

            this[socket] = undefined;
            this.initialize();
        }

        return instance;
    }
    /**
     * Method responsible for initializing SocketClientManager class. Creates new socket connected to routes.
     */
    initialize(){

        this[socket] = io();

        this[socket].on('connect', this.onSocketConnection.bind(this));
        this[socket].on(EventEnums.BOTH_PLAYERS_READY, this.onBothPlayersReadyListener.bind(this));
        this[socket].on(EventEnums.PLAYER_MOVED, this.onPlayerMoveListener.bind(this));
        this[socket].on(EventEnums.SERVER_PLAYER_LOGIN, this.onPlayerLogin.bind(this));
        this[socket].on(EventEnums.SERVER_PLAYER_DISCONNECTED, this.onPlayerDisconnect.bind(this));
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
     * Callback method called after receiving from server information about player login into game board page.
     * @param {Object}  data    Data received from player client who just logged into game board page.
     */
    onPlayerLogin(data){

        this.notify(EventEnums.SOCKET_TO_CONTROLLER_PLAYER_LOGIN, data);
    }
    /**
     * Callback method called after receiving from server information about player disconnecting from game.
     * @param {Object}  data
     * @param {string}  data.user
     * @param {string}  data.colour
     */
    onPlayerDisconnect(data){

        this.notify(EventEnums.SOCKET_TO_CONTROLLER_PLAYER_DISCONNECT, data);
    }
    /**
     * Callback function after successful socket connection to routes. Notifies main controller that connection is ready, and player data can be fetched from server.
     */
    onSocketConnection(){

        this.notify(EventEnums.SOCKET_CONNECTION_ESTABLISHED);
    }
    onBothPlayersReadyListener(){

        this.notify(EventEnums.BOTH_PLAYERS_READY);
    }
    /**
     * Method responsible for notifying controller after receiving message from server about move made by player.
     * @param {Object}  data    Data received from server
     */
    onPlayerMoveListener(data){

        this.notify(EventEnums.CLIENT_NOTIFY_MOVE_READY, data);
    }
    sendPlayerMoveToServer(data){

        this.emitEvent(EventEnums.SEND_PLAYER_MOVE, data);
    }
    sendToServerPlayerOnline(data){

        const socketId = this.getSocketId();

        Object.assign(data, {socketId});

        this.emitEvent(EventEnums.SEND_PLAYER_LOGIN, data);
    }
    emitEvent(eventName, data){

        this.getSocket().emit(eventName, data);
    }
    getSocketId(){

        return this[socket].id;
    }
    getSocket(){

        return this[socket];
    }
}

module.exports = SocketClientManager;