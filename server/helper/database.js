/**
 * @author Lukasz Lach
 */

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const databaseEnums = require('./../../enums/database_enums');
const config = require('./config');
const colourEnums = require('./../../enums/colours');
const boardHelper = require('./../helper/board_helper');

const database = Symbol();

/**
 * @class
 * @typedef {Object} DatabaseConnection
 */
class DatabaseConnection{

    constructor(){

        //this.insertNewUser('ania', '46');
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

            return db.collection(databaseEnums.USERS).insertOne(databaseDocument);
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

            return db.collection(databaseEnums.USERS).find({user}).toArray();
        });
    }
    /**
     * Method responsible for adding game id to certain user games list array.
     * @param {string}  user    Name of user.
     * @param {string}  gameId  Unique game id from database.
     * @returns {Promise}
     */
    addGameToUserGames(user, gameId){

        const databaseConnectionObject = this;
        let userData = {};

        return this.findUserByName(user).then(function(data){

            data[0].games.push(gameId);

            userData.user = data[0].user;
            userData.password = data[0].password;
            userData.games = data[0].games;

            return databaseConnectionObject.makeDatabaseConnection().then(function(db){

                return db.collection(databaseEnums.USERS).updateOne({user}, userData);
            }).catch(function(error){

                console.log(error);
            })
        }).catch(function(error){

            console.log(error);
        })
    }
    /**
     * Method responsible for inserting into database new game document.
     * @param {string}  startingPlayer          Name of starting player.
     * @param {Object}  serializedBoardModel    JSON data about game board state.
     * @returns {Promise}   Returns promise. Resolved promise contains data about inserted document.
     */
    insertNewGame(startingPlayer, serializedBoardModel){

        const databaseDocument = {

            white: startingPlayer,
            black: null,
            boardData: serializedBoardModel,
            activePlayer: 'white',
            hasEnded: false,
            messages: []
        }

        return this.makeDatabaseConnection().then(function(db){

            return db.collection(databaseEnums.GAMES).insertOne(databaseDocument);
        }).catch(function(error){

            console.log(error);
        })
    }
    /**
     * Method responsible for obtaining game data from database by game id.
     * @param {string}  gameId  Unique game identifier from database.
     * @returns {Promise}   Returns promise. Resolved promise contains game data.
     */
    getGameDataById(gameId){

        const ObjectID = mongo.ObjectID

        return this.makeDatabaseConnection().then(function(db){

            return db.collection(databaseEnums.GAMES).findOne({_id: new ObjectID(gameId)});
        }).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Method responsible for getting all registered active games.
     * @returns {Promise<any>}  Returns promise. Fulfilled promise contains games data.
     */
    getAllGamesData(){

        return this.makeDatabaseConnection().then(function(db){

            return db.collection(databaseEnums.GAMES).find({}).toArray();
        }).catch(function(error){

            console.log(error);
        })
    }
    /**
     * Method responsible for updating in database game data of certain Id.
     * @param {string}          gameId                  Unique ID in database of game to update. Required parameter.
     * @param {string|null}     activePlayer            Colour of active player (white or black). Optional parameter.
     * @param {Object|null}     serializedBoardModel    Object with new game board data. Optional parameter.
     * @param {string|null}     blackPlayer             Name of second (black) player. Optional parameter.
     * @param {boolean|null}    hasEnded                Boolean variable indicating whether game has ended or not.
     * @param {Array|null}      messages                Array of messages.
     * @returns {Promise}                               Returns promise. Resolved promise contains data about connection to database.
     */
    updateGameData(gameId, activePlayer, serializedBoardModel, blackPlayer, hasEnded, messages){

        const ObjectID = mongo.ObjectID;

        return this.getGameDataById(gameId).then(function(currentGameData){

            const newGameData = {

                white: currentGameData.white,
                black: blackPlayer ? blackPlayer : currentGameData.black,
                boardData: serializedBoardModel ? serializedBoardModel : currentGameData.boardData,
                activePlayer: activePlayer ? activePlayer : currentGameData.activePlayer,
                hasEnded: hasEnded ? hasEnded : currentGameData.hasEnded,
                messages: messages ? messages : currentGameData.messages
            }

            return this.makeDatabaseConnection().then(function(db){

                return db.collection(databaseEnums.GAMES).updateOne({_id: new ObjectID(gameId)}, newGameData).then(function(updatedDb){

                    return this.getGameDataById(gameId);
                }.bind(this)).catch(function(error){

                    console.log(error);
                });
            }.bind(this)).catch(function(error){

                console.log(error);
            });
        }.bind(this)).catch(function(error){

            console.log(error);
        });
    }
    changeActivePlayerInGame(gameId, activePlayer){

        return this.updateGameData(gameId, activePlayer);
    }
    changeBoardDataModelInGame(gameId, serializedBoardModel){

        return this.updateGameData(gameId, null, serializedBoardModel);
    }
    changeBlackPlayerNameInGame(gameId, blackPlayer){

        const databaseHelperObject = this;

        return this.updateGameData(gameId, null, null, blackPlayer).then(function(data){

            return databaseHelperObject.addGameToUserGames(blackPlayer, gameId);
        }).catch(function(error){

            console.log(error);
        });
    }
    registerPlayerMove(gameId, activePlayer, sourceX, sourceY, targetX, targetY){

        const newActivePlayer = activePlayer === colourEnums.WHITE ? colourEnums.BLACK : colourEnums.WHITE;
        let updatedBoardData;

        return this.getGameDataById(gameId).then(function(data){

            updatedBoardData = boardHelper.updateBoardDataByPlayerMove(data.boardData, {

                sourceX,
                sourceY,
                targetX,
                targetY
            });

            return this.updateGameData(gameId, newActivePlayer, updatedBoardData);
        }.bind(this)).catch(function(error){

            console.log(error);
        });
    }
    endGame(gameId){

        return this.updateGameData(gameId, null, null, null, true);
    }
    addMessageToGame(gameId, message){

        let messages;

        return this.getGameDataById(gameId).then(function(data){

            messages = data.messages;
            messages.push(message);

            return this.updateGameData(gameId, null, null, null, null, messages);
        }.bind(this)).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Helper method responsible for making connection to database.
     * @returns {Promise} Returns promise. Resolved promise returns database object, which can be used to insert, find, etc.
     */
    makeDatabaseConnection(){

        return MongoClient.connect(config.databaseUrl);
    }
}

module.exports = DatabaseConnection;