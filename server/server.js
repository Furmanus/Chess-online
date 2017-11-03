/**
 * @author Lukasz Lach
 */

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

//declaration of private variables
const server = Symbol();

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

        this[server] = undefined;

        this.initialize();
    }

    /**
     * Initializes server.
     */
    initialize(){

        this.initializeExpressApplication();
        this.startListening();
    }

    /**
     * Method which makes server use various middleware functions and sets server variables.
     */
    initializeExpressApplication(){

        this[server] = express();

        this.getServer().use(bodyParser.urlencoded({extended: true}));
        this.getServer().use(bodyParser.json());
        this.getServer().use(cookieParser());
        this.getServer().use('/', express.static(path.join(__dirname, '../client')));
        this.getServer().set('port', process.env.PORT || 3000);
    }

    /**
     * Method responsible for running server.
     */
    startListening(){

        const port = this.getServer().get('port');

        this.getServer().listen(port, function(){

            console.log(`Server is listening at port ${port}.`);
        })
    }

    /**
     * Returns server instance.
     * @returns {Server}
     */
    getServer(){

        return this[server];
    }
}

module.exports = Server;