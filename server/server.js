/**
 * @author Lukasz Lach
 */
const SocketManager = require('./managers/socket_manager');
const Router = require('./routes/router');
const eventEmmiter = require('./helper/event_emmiter');
const MongoDb = require('./helper/database');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const io = require('socket.io');
const MainController = require('./controllers/main_controller');
const EventEnums = require('./../enums/events');
const SessionManager = require('./helper/session_manager');

//declaration of private variables
const server = Symbol();
const app = Symbol();
const socketManager = Symbol();
const mainController = Symbol();
const router = Symbol();
const databaseConnection = Symbol();
const sessionManager = Symbol();

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
        this[sessionManager] = new SessionManager();

        this.initialize();
        this.listenToEvents();
    }
    /**
     * Initializes routes.
     */
    initialize(){

        this[mainController] = new MainController();

        this.initializeExpressApplication();
        this.initializeServer();
        this.createSocketManager(this.getServer(), io);
        this.getRouter().addSocketManager(this.getSocketManager());

        this.startListening();
    }
    listenToEvents(){

        eventEmmiter.on(EventEnums.CLIENT_DISCONNECTED, this.onClientDisconnect.bind(this));
    }
    initializeServer(){

        this[server] = http.Server(this.getApp());
    }
    /**
     * Method which makes router use various middleware functions and sets routes variables.
     */
    initializeExpressApplication(){

        this[app] = express();

        this[router] = new Router(this.getMainController(), this.getSessionManager())
        this.getApp().use(bodyParser.urlencoded({extended: true}));
        this.getApp().use(bodyParser.json());
        this.getApp().use(cookieParser('sfsergxxz@#$%r2'));
        this.getApp().use(this.getSessionManager().getSession());
        this.getApp().use(express.static(path.join(__dirname, '../client')));
        this.getApp().use(this.getRouter().getRouterObject());
        this.getApp().set('port', process.env.PORT || 3000);
        this.getApp().set('view engine', 'pug');
        this.getApp().set('views','./client/views');
    }
    /**
     * Creates helper object responsible for managing sockets.
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
        //TODO
        console.log('client disconnected');
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
    /**
     * Returns session manager object.
     * @returns {SessionManager}
     */
    getSessionManager(){

        return this[sessionManager];
    }
}

module.exports = Server;