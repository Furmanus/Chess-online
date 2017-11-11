/**
 * @author Lukasz Lach
 */

const connectedClientData = Symbol();
const socket = Symbol();

/**
 * @class
 * @typedef {Object}    Client
 */
class Client{

    /**
     * @constructor
     * @param {Socket}  socketObject
     * @param {Object}  data
     */
    constructor(socketObject, data = {}){

        /**
         * @type {Object}
         */
        this[connectedClientData] = data;
        /**
         * @type {Socket}
         */
        this[socket] = socketObject;
    }
}

module.exports = Client;