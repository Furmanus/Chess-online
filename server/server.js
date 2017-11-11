/**
 * @author Lukasz Lach
 */
const SocketManager = require('./socket_manager/socket_manager');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const io = require('socket.io');

//declaration of private variables
const server = Symbol();
const app = Symbol();
const socketManager = Symbol();

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

        this.initialize();
    }

    /**
     * Initializes server.
     */
    initialize(){

        this.initializeExpressApplication();
        this.initializeServer();
        this.createSocketManager(this.getServer(), io);
        this.startListening();
    }

    initializeServer(){

        this[server] = http.Server(this.getApp());
    }

    /**
     * Method which makes server use various middleware functions and sets server variables.
     */
    initializeExpressApplication(){

        this[app] = express();

        this.getApp().use(bodyParser.urlencoded({extended: true}));
        this.getApp().use(bodyParser.json());
        this.getApp().use(cookieParser());
        this.getApp().use('/', express.static(path.join(__dirname, '../client')));
        this.getApp().set('port', process.env.PORT || 3000);
    }

    /**
     * TODO uzupelnic
     * @param {Object}  server      Server instance.
     * @param {Object}  socketIo    SocketIO connection instance.
     */
    createSocketManager(server, socketIo){

        this[socketManager] = new SocketManager(server, socketIo);
    }

    /**
     * Method responsible for running server.
     */
    startListening(){

        const port = this.getApp().get('port');

        this.getServer().listen(port, function(){

            console.log(`Server is listening at port ${port}.`);
        })
    }

    /**
     * Returns http server instance.
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
}

module.exports = Server;