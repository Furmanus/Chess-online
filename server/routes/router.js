/**
 * @author Lukasz Lach
 */

const express = require('express');
const EventEnums = require('./../../enums/events');
const ColourEnums = require('./../../enums/colours');

const eventEmmiter = require('./../helper/event_emmiter');
const path = require('path');

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
        this.getRouterObject().all('*', this.isUserLoggedIn.bind(this));
        this.getRouterObject().get('/dashboard', this.dashboardPage.bind(this));
        this.getRouterObject().post('/create_game', this.createGame.bind(this));
        this.getRouterObject().get('/board_state', this.getBoardState.bind(this));
        this.getRouterObject().post('/figure_moves', this.boardClickRequestHandler.bind(this));
        this.getRouterObject().post('/initial_player_data', this.getInitialPlayerData.bind(this));
        this.getRouterObject().get('/games', this.getUserGames.bind(this));
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
        const thisRouter = this;
        let createdGameId;

        this.getMainController().createNewGame(user).then(function(data){

            createdGameId = data.ops[0]._id;

            thisRouter.getMainController().addGameToUser(user, createdGameId).then(function(){

                res.send(data.ops[0]);
            }).catch(function(error){

                console.log(error);
            });
        }).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Callback function which takes from game model initial player data and sends it back in response.
     * @param {Object} req
     * @param {Object} res
     */
    getInitialPlayerData(req, res){

        const playerData = this.getMainController().getInitialPlayerData(req.body.id);

        res.send(JSON.stringify(playerData))

        if(playerData.colour === ColourEnums.BLACK){

            eventEmmiter.emit(EventEnums.SEND_SERVER_GAME_STATUS_READY, {id: playerData.opponentId});
        }
    }
    /**
     * Callback function for '/board_state' GET route. Takes board states from main controller and sends it in response.
     * @param {Object} req
     * @param {Object} res
     */
    getBoardState(req, res){

        res.json(this.getMainController().getBoardState());
    }
    /**
     * Callback function for '/dashboard' GET route. Renders dashboard page.
     * @param req
     * @param res
     */
    dashboardPage(req, res){

        req.session.touch(req.sessionID);
        res.render('dashboard', {user: req.query.user});
    }
    /**
     * Callback function for '/game' GET route. Renders page with game board.
     * @param req
     * @param res
     */
    gamePage(req, res){

        req.session.touch(req.sessionID);
        res.render('board');
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

        const router = this;

        this.getMainController().getDatabaseUserDataPromise(req.body.login).then(function(data){

            let requestResult = {};

            if(!data.length || data[0].password !== req.body.password){

                requestResult.loginSuccessful = false;
                requestResult.errorMessage = 'Invalid login or password.';
            }else{

                router.getSessionManager().getLoggedUsersMap().set(req.body.login, req.sessionID);
                req.session.user = req.body.login;
                requestResult.loginSuccessful = true;
            }

            res.send(requestResult);
        }).catch(function(error){

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
        const routerObject = this;
        let gamesList;
        let comparisionResult;
        let filteredList;

        this.getMainController().getDatabaseUserDataPromise(user).then(function(data){

            gamesList = data[0].games;

            routerObject.getMainController().getAllGamesData().then(function(gamesListData){

                gamesListData.forEach(function(item){

                    delete item.boardData;
                });

                filteredList = gamesListData.filter(function(item){

                    comparisionResult = false;

                    for(let playerGameData of gamesList){

                        if(playerGameData.toString() === item._id.toString()){

                            comparisionResult = true;
                            break;
                        }
                    }

                    return comparisionResult;
                });

                res.send(filteredList);
            }).catch(function(error){

                console.log(error);
            });
        }).catch(function(error){

            console.log(error);
        });
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

            res.send({forcedRedirectUrl: '/'});
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