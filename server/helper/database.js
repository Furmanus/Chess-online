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

        this.insertNewUser('ania', '4646456').then(function(){console.log('insertion successful')});
    }
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
    findUserByName(user){

        return this.makeDatabaseConnection().then(function(db){

            return db.collection(DatabaseEnums.USERS).find({user}).toArray();
        });
    }
    makeDatabaseConnection(){

        return MongoClient.connect(databaseUrl);
    }
}

module.exports = DatabaseConnection;