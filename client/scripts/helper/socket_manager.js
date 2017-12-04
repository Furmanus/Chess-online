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
     * Callback function after successful socket connection to routes. Notifies main controller that connection is ready, and player data can be fetched from server.
     */
    onSocketConnection(){

        this.notify(EventEnums.SOCKET_CONNECTION_ESTABLISHED);
    }
    onBothPlayersReadyListener(){

        this.notify(EventEnums.BOTH_PLAYERS_READY);
    }
    onPlayerMoveListener(data){

        this.notify(EventEnums.CLIENT_NOTIFY_MOVE_READY, data);
    }
    getSocketId(){

        return this[socket].id;
    }
}

module.exports = SocketClientManager;