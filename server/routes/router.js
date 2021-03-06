/**
 * @author Lukasz Lach
 */

const express = require('express');
const EventEnums = require('./../../enums/events');
const ColourEnums = require('./../../enums/colours');

const bcrypt = require('bcrypt');
const xssFilters = require('xss-filters');

const mainController = Symbol();
const socketManager = Symbol();
const sessionManager = Symbol();
const router = Symbol();

/**
 * @class
 */
class Router{
    /**
     * Constructor for router class.
     * @param {MainController}  mainControllerObject
     * @param {SessionManager}  sessionManagerObject
     * @return {Router}
     */
    constructor(mainControllerObject, sessionManagerObject){

        /**@type {MainController}*/
        this[mainController] = mainControllerObject;
        /**@type {SessionManager}*/
        this[sessionManager] = sessionManagerObject;
        /**@type {Object}*/
        this[router] = express.Router();

        this.initializePaths();
    }
    addSocketManager(socketManagerObject){

        this[socketManager] = socketManagerObject;
    }
    initializePaths(){
        //TODO zamienić ścieżki na enumy
        this.getRouterObject().get('/', this.mainLoginPage.bind(this));
        this.getRouterObject().post('/login_form_validate', this.playerLoginHandler.bind(this));
        this.getRouterObject().get('/logout', this.logoutUser.bind(this));
        this.getRouterObject().get('/game', this.gamePage.bind(this));
        this.getRouterObject().post('/register', this.registerClient.bind(this));
        this.getRouterObject().all('*', this.isUserLoggedIn.bind(this));
        this.getRouterObject().get('/dashboard', this.dashboardPage.bind(this));
        this.getRouterObject().post('/create_game', this.createGame.bind(this));
        this.getRouterObject().post('/figure_moves', this.boardClickRequestHandler.bind(this));
        this.getRouterObject().post('/initial_player_data', this.getInitialPlayerData.bind(this));
        this.getRouterObject().get('/games', this.getUserGames.bind(this));
        this.getRouterObject().get('/games_to_join', this.getGamesToJoin.bind(this));
        this.getRouterObject().post('/join_game', this.joinGame.bind(this));
        this.getRouterObject().post('/save_message', this.onReceiveMessageToStore.bind(this));
        this.getRouterObject().get('/game_messages', this.onFetchGameMessages.bind(this));
    }
    /**
     * Callback function for '/' GET route. Checks if user is already logged in and if he is, redirects him to dashboard. Renders login page otherwise.
     * @param req
     * @param res
     */
    mainLoginPage(req, res){

        const user = req.session.user;
        const userId = req.sessionID;

        if(req.session.user && this.getSessionManager().isUserLogged(user) && this.getSessionManager().getUserSessionId(user) === userId){

            req.session.touch(userId);
            res.redirect(`/dashboard?user=${user}`);
        }else {

            res.render('login');
        }
    }
    /**
     * Callback function for '/create_game' POST route.
     * @param req
     * @param res
     */
    createGame(req, res){

        const user = req.body.user;
        let firstPromiseResult;
        let createdGameId;

        this.getMainController().createNewGame(user).then(function(data){

            firstPromiseResult = data;
            createdGameId = data.ops[0]._id;

            return this.getMainController().addGameToUser(user, createdGameId);
        }.bind(this)).then(function(){

            res.send(firstPromiseResult.ops[0]);
        }).catch(function(error){

            console.log(error);
        });;
    }
    /**
     * Callback method for '/game_messages' GET request. Responsible for fetching game messages from database and sending it back to client.
     * @param req
     * @param res
     */
    onFetchGameMessages(req, res){

        const gameId = req.query.gameId;

        this.getMainController().getMessagesFromDatabase(gameId).then(function(data){

            res.send({messages: data.messages});
        }).catch(function(error){

            console.log(error);
        })
    }
    /**
     * Callback method for '/save_message' POST request. Responsible for storing messages from game page panel in database.
     * @param req
     * @param res
     */
    onReceiveMessageToStore(req, res){

        const {
            gameId,
            message,
            moveData
        } = req.body;

        this.getMainController().storeMessageInDatabase(gameId, message, moveData).then(function(){

            res.send({result: 'success'});
        }).catch(function(error){

            res.send({result: 'failure', message: 'Failed to store message'});
        });
    }
    /**
     * Callback method for '/register' POST request. Responsible for registering users in database.
     * @param req
     * @param res
     */
    registerClient(req, res){

        const username = req.body.user;
        const password = req.body.password;

        //we check if username already exist in database
        this.getMainController().getUserDataFromDatabase(username).then(function(data){

            //if yes (promise returned non empty array, we send message to client that operation was unsuccessful
            if(data.length){

                res.send({result: false, message: 'User already exist'});
            }else{
                //in other case we register user. After user is registered in database, we set user in session and register him and his sessionID in users map
                this.getMainController().registerUserInDatabase(username, password).then(function(){

                    this.getSessionManager().getLoggedUsersMap().set(username, req.sessionID);
                    req.session.user = username;
                    res.send({result: true, message: 'User successfully registered'});
                }.bind(this)).catch(function(error){

                    console.log(error);
                });
            }
        }.bind(this)).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Callback function which takes from game model initial player data and sends it back in response.
     * @param {Object} req
     * @param {Object} res
     */
    getInitialPlayerData(req, res){

        const user = req.body.user;
        const gameId = req.body.gameId;
        const usersLoggedInGame = this.getMainController().getUserLoggedInGame(gameId);
        let colour;
        let opponentColour;
        let messages;

        this.getMainController().getGameDataByIdPromise(gameId).then(function(data){

            if(data.white === user){

                colour = ColourEnums.WHITE;
            }else if(data.black === user){

                colour = ColourEnums.BLACK;
            }else{

                throw new Error('User is not recognized as active player in this game');
            }

            if(data.black && data.black !== user){

                opponentColour = ColourEnums.BLACK;
            }else if(data.white !== user){

                opponentColour = ColourEnums.WHITE;
            }

            res.send({

                colour,
                opponentColour,
                activePlayer: data.activePlayer,
                boardData: data.boardData,
                messages: data.messages,
                hasEnded: data.hasEnded,
                users: usersLoggedInGame
            });
        }).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Callback function for '/dashboard' GET route. Renders dashboard page.
     * @param req
     * @param res
     */
    dashboardPage(req, res){

        req.session.touch(req.sessionID);
        res.render('dashboard', {user: xssFilters.inHTMLData(req.query.user)});
    }
    /**
     * Callback function for '/game' GET route. Renders page with game board.
     * @param req
     * @param res
     */
    gamePage(req, res){

        const user = req.query.user;
        const gameId = req.query.id;
        let examinedGameObject;
        let whitePlayerValidation;
        let blackPlayerValidation;

        this.getMainController().getAllGamesData().then(function(gamesList){

            examinedGameObject = gamesList.find(function(item){

                return item._id.toString() === gameId;
            });

            whitePlayerValidation = examinedGameObject.white && examinedGameObject.white.toString() === user;
            blackPlayerValidation = examinedGameObject.black && examinedGameObject.black.toString() === user;

            if(examinedGameObject && (whitePlayerValidation || blackPlayerValidation)){
                //TODO w przypadku gdy czarny jest nullem i user nie jest biały, wpisać usera do bazy jako czarnego gracza
                req.session.touch(req.sessionID);
                res.render('board', {

                    whitePlayer: xssFilters.inHTMLData(examinedGameObject.white.toString()),
                    blackPlayer: examinedGameObject.black ? xssFilters.inHTMLData(examinedGameObject.black.toString()) : 'waiting for player to join...'
                });
            }else{
                //TODO zamienić na render strony 403 forbidden access
                console.log('forbidden access');
                res.render('login');
            }
        }).catch(function(error){

            console.log('game page route error');
            console.log(error);
        });
    }
    /**
     * Callback function for '/join_game' post route.
     * @param {Object}  req
     * @param {Object}  res
     */
    joinGame(req, res){

        const user = req.body.user;
        const gameToJoinObject = req.body.data;
        const id = gameToJoinObject._id.toString();
        let examinedGame;

        this.getMainController().getAllGamesData().then(function(data){

             examinedGame = data.find(function(gamesListItem){

                 return gameToJoinObject._id.toString() === gamesListItem._id.toString();
             });

             if(examinedGame){

                 if(examinedGame.white && !examinedGame.black){

                     this.getMainController().joinBlackPlayerToGame(id, user).then(function(joinResultData){

                         res.send({result: true, message: 'You joined chosen game'});
                     }).catch(function(error){

                         console.log(error);
                     });
                 }else if(examinedGame.white && examinedGame.black){

                     res.send({result: false, message: 'This game already has two players'});
                 }
             }else{

                 res.send({result: false, message: 'Game not found'});
             }
        }.bind(this)).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Callback function for '/logout' GET route. Destroys session, removes user from logged users and redirects user to login page.
     * @param req
     * @param res
     */
    logoutUser(req, res){

        req.session.destroy(function(){

            this.getSessionManager().removeUser(req.query.user);
            res.send({forcedRedirectUrl: '/'});
        }.bind(this));
    }
    /**
     * Callback function for '/figure_moves' POST request. Checks whether any figure is currently selected by player, and if yes, send to client array of possible moves.
     * @param {Object} req  Request object.
     * @param {Object} res  Response object.
     */
    boardClickRequestHandler(req, res){

        let chosenFigurePossibleMoves = undefined;
        const coordinates = {x: parseInt(req.body.x), y: parseInt(req.body.y)};
        const colour = req.body.colour;
        const highlightedCell = this.getMainController().getCurrentlyHighlightedCell();

        req.session.touch(req.sessionID);

        if(!highlightedCell){

            chosenFigurePossibleMoves = this.getMainController().getFigureMoves(coordinates, colour);

            if(Object.keys(chosenFigurePossibleMoves).length === 0){

                res.send(JSON.stringify({action: 'no action'}));
            }else {

                this.getMainController().setCurrentlyHighlightedCell(coordinates.x, coordinates.y);
                this.getMainController().setCurrentFigurePossibleMoves(chosenFigurePossibleMoves);
                res.send(JSON.stringify({action: 'highlight', data: chosenFigurePossibleMoves}));
            }
            return;
        }
        if(highlightedCell && coordinates.x === highlightedCell.x && coordinates.y === highlightedCell.y){

            this.getMainController().resetCurrentlyHighlightedCell();
            this.getMainController().resetCurrentFigurePossibleMoves();
            res.send(JSON.stringify({action: 'reset'}));
            return;
        }
        if(highlightedCell && this.getMainController().checkIfChosenCoordinatesMeetsPossibleMoves(coordinates)){

            const data = {

                sourceCoords: highlightedCell,
                targetCoords: coordinates,
                movedFigure: undefined,
                previousPlayer: undefined,
                capturedFigure: undefined,
                activePlayer: undefined,
                activePlayerFiguresToMove: undefined
            }
            //move figure(change data) in board model
            data.movedFigure = this.getMainController().moveFigure(highlightedCell, coordinates);
            data.previousPlayer = this.getMainController().getActivePlayer();
            //change active player in game model
            data.activePlayer = this.getMainController().toggleActivePlayer();
            data.capturedFigure = this.getMainController().getFigureCapturedLastTurn();

            data.activePlayerFiguresToMove = this.getMainController().getActivePlayerFiguresToMove();

            //we emit event containing move data to all connected sockets
            this.getSocketManager().emitEventToAll(EventEnums.PLAYER_MOVED, data);

            //reset temporary data
            this.getMainController().resetCurrentFigurePossibleMoves();
            this.getMainController().resetCurrentlyHighlightedCell();
        }
        if(highlightedCell && !(coordinates.x === highlightedCell.x && coordinates.y === highlightedCell.y)){

            res.send(JSON.stringify({action: 'no action'}));
        }
    }
    playerLoginHandler(req, res){

        this.getMainController().getDatabaseUserDataPromise(req.body.login).then(function(data){

            let requestResult = {};

            if(!data.length){

                requestResult.loginSuccessful = false;
                requestResult.errorMessage = 'Invalid login or password.';

                res.send(requestResult);
            }else {

                bcrypt.compare(req.body.password, data[0].password).then(function (match) {

                    if(match) {

                        if (this.getSessionManager().getLoggedUsersMap().get(req.body.login)) {

                            requestResult.loginSuccessful = false;
                            requestResult.errorMessage = 'User already logged in.'
                        } else {

                            this.getSessionManager().getLoggedUsersMap().set(req.body.login, req.sessionID);
                            req.session.user = req.body.login;
                            requestResult.loginSuccessful = true;
                        }
                    }else{

                        requestResult.loginSuccessful = false;
                        requestResult.errorMessage = 'Invalid login or password.';
                    }

                    res.send(requestResult);
                }.bind(this)).catch(function (err) {

                    console.log(error);
                });
            }
        }.bind(this)).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Callback function for '/games' GET route. Method responsible for taking from database data about all user active games.
     * This happens in two steps - in first step we connect to database and get list of user active games ID's. In next step we take data off all active
     * games in database and filter them by ID's of players active games. Result is send to client in response.
     * @param req
     * @param res
     */
    getUserGames(req, res){

        const user = req.query.user;
        let gamesList;
        let comparisionResult;
        let filteredList;

        this.getMainController().getDatabaseUserDataPromise(user).then(function(data){

            gamesList = data[0].games;

            return this.getMainController().getAllGamesData();
        }.bind(this)).then(function(gamesListData){

            gamesListData.forEach(function(item){
                //we delete info about board data, as it is not needed to send to user
                delete item.boardData;
            });

            filteredList = gamesListData.filter(function(item){

                comparisionResult = false;

                for(let playerGameData of gamesList){

                    if((playerGameData.toString() === item._id.toString()) && !item.hasEnded){

                        comparisionResult = true;
                        break;
                    }
                }

                return comparisionResult;
            });

            res.send(filteredList);
        }.bind(this)).catch(function(error){

            console.log(error);
        });;
    }
    /**
     * Callback function for '/games_to_join' GET route. Responsible for obtaining from database games to which user can join.
     * @param {Object}  req
     * @param {Object}  res
     */
    getGamesToJoin(req, res){

        const user = req.query.user;
        const routerObject = this;
        let filteredList;

        this.getMainController().getAllGamesData().then(function(gamesListData){

            gamesListData.forEach(function(item){

                delete item.boardData;
            });

            filteredList = gamesListData.filter(function(item){

                if(item.white.toString() !== user && item.black === null && item.hasEnded === false){

                    return true;
                }

                return false;
            });

            res.send(filteredList);
        }).catch(function(error){

            console.log(error);
        })
    }
    /**
     * Middleware method for all routes, validates whether user is already logged in. If yes, next() method is called, otherwise, login page is rendered.
     * @param req
     * @param res
     * @param next
     */
    isUserLoggedIn(req, res, next){

        const user = req.session.user;
        const userId = req.sessionID;

        if(req.session.user && this.getSessionManager().isUserLogged(user) && this.getSessionManager().getUserSessionId(user) === userId){

            next();
        }else{

            if(req.query.isAjaxRequest || req.body.isAjaxRequest) {

                res.send({forcedRedirectUrl: '/'});
            }else{

                res.render('login');
            }
        }
    }
    /**
     * Returns main controller of server side.
     * @return {MainController}
     */
    getMainController(){

        return this[mainController];
    }
    /**
     * Returns instance of socket manager.
     * @returns {SocketManager}
     */
    getSocketManager(){

        return this[socketManager];
    }
    /**
     * Returns instance of express router object, which handles all http request send to server.
     * @returns {Object}
     */
    getRouterObject(){

        return this[router];
    }
    /**
     * Returns instance of session manager.
     * @returns {SessionManager}
     */
    getSessionManager(){

        return this[sessionManager];
    }
}

module.exports = Router;