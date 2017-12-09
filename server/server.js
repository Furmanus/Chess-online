/**
 * @author Lukasz Lach
 */
const SocketManager = require('./socket_manager/socket_manager');
const Router = require('./routes/router');
const eventEmmiter = require('./helper/event_emmiter');
const MongoDb = require('./helper/database');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const io = require('socket.io');
const MainController = require('./controllers/main_controller');
const EventEnums = require('./../enums/events');

//declaration of private variables
const server = Symbol();
const app = Symbol();
const socketManager = Symbol();
const mainController = Symbol();
const router = Symbol();
const databaseConnection = Symbol();

/**
 * @class
 * @typedef {Object}    Server
 */
class Server{

    /**
     * Server constructor.
     * @constructor
     */
    constructor(){
        // declaration of private variables. They are initialized later on.
        this[app] = undefined;
        this[socketManager] = undefined;
        this[server] = undefined;
        this[mainController] = undefined;
        this[router] = undefined;
        this[databaseConnection] = new MongoDb();

        this.bothPlayersReadyEventListener = this.bothPlayersReadyEventListener.bind(this);
        this.onClientDisconnect = this.onClientDisconnect.bind(this);

        this.initialize();
        this.listenToEvents();
    }

    listenToEvents(){

        eventEmmiter.on(EventEnums.SEND_SERVER_GAME_STATUS_READY, this.bothPlayersReadyEventListener);
        eventEmmiter.on(EventEnums.CLIENT_DISCONNECTED, this.onClientDisconnect);
    }

    /**
     * Initializes routes.
     */
    initialize(){

        this[mainController] = new MainController();

        this.initializeExpressApplication();
        this.initializeServer();
        this.createSocketManager(this.getServer(), io);
        //TODO naprawic zjebany singleton routera
        this.getRouter().addSocketManager(this.getSocketManager());

        this.startListening();
    }

    initializeServer(){

        this[server] = http.Server(this.getApp());
    }

    /**
     * Method which makes router use various middleware functions and sets routes variables.
     */
    initializeExpressApplication(){

        this[app] = express();

        this[router] = new Router(this.getMainController())
        this.getApp().use(bodyParser.urlencoded({extended: true}));
        this.getApp().use(bodyParser.json());
        this.getApp().use(cookieParser());
        this.getApp().use('/', express.static(path.join(__dirname, '../client')));
        this.getApp().use(this.getRouter().getRouterObject());
        this.getApp().set('port', process.env.PORT || 3000);
    }

    /**
     * TODO uzupelnic
     * @param {Object}  server      Server instance.
     * @param {Object}  socketIo    SocketIO connection instance.
     */
    createSocketManager(server, socketIo){

        this[socketManager] = new SocketManager(server, socketIo, this.getMainController());
    }

    /**
     * Method responsible for running routes.
     */
    startListening(){

        const port = this.getApp().get('port');

        this.getServer().listen(port, function(){

            console.log(`Server is listening at port ${port}.`);
        })
    }
    /**
     * Callback function triggered after client disconnection.
     * @param {Object}  data
     * @param {string}  data.socketId
     */
    onClientDisconnect(data){

        this.getMainController().removePlayerFromGameModel(data.socketId);
    }
    /**
     * Callback function triggered when router notifies server, that second player(black) has logged into game.
     */
    bothPlayersReadyEventListener(){

        this.getSocketManager().emitEventToAll(EventEnums.BOTH_PLAYERS_READY);
    }
    /**
     * Returns http routes instance.
     * @returns {Object}
     */
    getServer(){

        return this[server];
    }
    /**
     * Returns express app instance.
     * @returns {Object}
     */
    getApp(){

        return this[app];
    }
    /**
     * Returns socket connection.
     * @returns {SocketManager}
     */
    getSocketManager(){

        return this[socketManager];
    }
    /**
     * Returns main controller of server application.
     * @return {MainController}
     */
    getMainController(){

        return this[mainController];
    }
    /**
     * Returns router object.
     * @return {Object}
     */
    getRouter(){

        return this[router];
    }
}

module.exports = Server;