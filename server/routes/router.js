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
const router = Symbol();

/**
 * @class
 */
class Router{
    /**
     * Constructor for router class.
     * @param {MainController}  mainControllerObject
     * @return {Router}
     */
    constructor(mainControllerObject){

        /**@type {MainController}*/
        this[mainController] = mainControllerObject;
        /**@type {Object}*/
        this[router] = express.Router();

        this.getBoardState = this.getBoardState.bind(this);
        this.boardClickRequestHandler = this.boardClickRequestHandler.bind(this);
        this.getInitialPlayerData = this.getInitialPlayerData.bind(this);
        this.playerLoginHandler = this.playerLoginHandler.bind(this);
        this.getUserGames = this.getUserGames.bind(this);

        this.initializePaths();
    }
    addSocketManager(socketManagerObject){

        this[socketManager] = socketManagerObject;
    }
    initializePaths(){
        //TODO zamienić ścieżki na enumy
        this.getRouterObject().get('/board_state', this.getBoardState);
        this.getRouterObject().post('/figure_moves', this.boardClickRequestHandler);
        this.getRouterObject().post('/initial_player_data', this.getInitialPlayerData);
        this.getRouterObject().post('/login_form_validate', this.playerLoginHandler);
        this.getRouterObject().get('/games', this.getUserGames);
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
     * Callback function for '/figure_moves' POST request. Checks whether any figure is currently selected by player, and if yes, send to client array of possible moves.
     * @param {Object} req  Request object.
     * @param {Object} res  Response object.
     */
    boardClickRequestHandler(req, res){

        let chosenFigurePossibleMoves = undefined;
        const coordinates = {x: parseInt(req.body.x), y: parseInt(req.body.y)};
        const colour = req.body.colour;
        const highlightedCell = this.getMainController().getCurrentlyHighlightedCell();

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

            if(!data.length || data[0].password !== req.body.password){

                requestResult.loginSuccessful = false;
                requestResult.errorMessage = 'Invalid login or password.';
            }else{

                requestResult.loginSuccessful = true;
            }

            res.send(requestResult);
        }).catch(function(error){

            console.log(error);
        });
    }
    getUserGames(req, res){

        const user = req.query.user;

        this.getMainController().getDatabaseUserDataPromise(user).then(function(data){

            res.send(data[0].games);
        }).catch(function(error){

            console.log(error);
        });
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
}

module.exports = Router;