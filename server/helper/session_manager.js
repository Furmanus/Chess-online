/**
 * @author Lukasz Lach
 */

const session = require('express-session');

const options = Symbol();
const sessionObject = Symbol();
const loggedUsers = Symbol();

/**
 * @class
 * @typedef {Object} SessionManager
 */
class SessionManager{

    /**@constructor*/
    constructor(){

        /**@type {Object}*/
        this[options] = {
            secret: 'sfsergxxz@#$%r2',
            resave: true,
            saveUninitialized: true,
            path: '/',
            cookie: {
                maxAge: 100000000000,
                secure: false
            }
        };
        /**@type {Object}*/
        this[sessionObject] = session(this[options]);
        /**@type {Map}*/
        this[loggedUsers] = new Map();
    }
    /**
     * Method responsible for checking if user with certain username is logged in (has non expired session).
     * @param   {string}    username    Name of user.
     * @returns {boolean}               Boolean variable indicating whether user is logged in or not.
     */
    isUserLogged(username){

        return this.getLoggedUsersMap().has(username);
    }
    /**
     * Method which validates if certain user is logged in and his sessionId matches with sessionId stored in session manager.
     * @param {string}      username    Name of user.
     * @param {string}      sessionId   Id of user session.
     * @returns {boolean}               Boolean variable indicating whether user session Id matches session Id stored in session manager.
     */
    validateUserSessionId(username, sessionId){

        if(this.isUserLogged(username)) {

            return this.getLoggedUsersMap().get(username) === sessionId;
        }

        return false;
    }
    /**
     * Returns stored session ID of certain user.
     * @param {string}  username    Name of user.
     * @returns {string}            User session Id.
     */
    getUserSessionId(username){

        return this.getLoggedUsersMap().get(username);
    }
    /**
     * Removes user from session manager.
     * @param {string}  username    Name of user.
     */
    removeUser(username){

        if(this.isUserLogged(username)){

            this.getLoggedUsersMap().delete(username);
        }
    }
    /**
     * Returns session options object.
     * @returns {Object}
     */
    getOptions(){

        return this[options];
    }
    /**
     * Returns session object.
     * @returns {Object}
     */
    getSession(){

        return this[sessionObject];
    }
    /**
     * Returns map storing logged users (users with active session).
     * @returns {Map}
     */
    getLoggedUsersMap(){

        return this[loggedUsers];
    }
}

module.exports = SessionManager;