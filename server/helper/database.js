/**
 * @author Lukasz Lach
 */

const MongoClient = require('mongodb').MongoClient;
const DatabaseEnums = require('./../../enums/database_enums');
const databaseUrl = 'mongodb://chessadmin:chessadmin@ds129906.mlab.com:29906/chess';

const database = Symbol();

/**
 * @class
 * @typedef {Object} DatabaseConnection
 */
class DatabaseConnection{

    constructor(){

    }
    /**
     * Method responsible for inserting new user data into database.
     * @param {string}  user
     * @param {string}  password
     * @returns {Promise<T>} Returns promise. Resolved promise returns data obtained from database, rejected promise returns error object.
     */
    insertNewUser(user, password){

        const databaseDocument = {
            user,
            password,
            games: []
        };

        return this.makeDatabaseConnection().then(function(db){

            return db.collection(DatabaseEnums.USERS).insertOne(databaseDocument);
        }).catch(function(error){

            console.error(error);
        })
    }
    /**
     * Method responsible for obtaining user data from database.
     * @param {string}  user
     * @returns {Promise<T>}    Returns promise. Resolved promise returns array of user documents matching query {user: user}. Each data contains users name, password and array of
     * active games.
     */
    findUserByName(user){

        return this.makeDatabaseConnection().then(function(db){

            return db.collection(DatabaseEnums.USERS).find({user}).toArray();
        });
    }
    /**
     * Helper method responsible for making connection to database.
     * @returns {Promise} Returns promise. Resolved promise returns database object, which can be used to insert, find, etc.
     */
    makeDatabaseConnection(){

        return MongoClient.connect(databaseUrl);
    }
}

module.exports = DatabaseConnection;