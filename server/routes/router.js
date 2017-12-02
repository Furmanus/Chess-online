/**
 * @author Lukasz Lach
 */

const express = require('express');
const EventEnums = require('./../../enums/events');
const ColourEnums = require('./../../enums/colours');

const eventEmmiter = require('./../helper/event_emmiter');

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

        this.initializePaths();
    }
    addSocketManager(socketManagerObject){

        this[socketManager] = socketManagerObject;
    }
    initializePaths(){

        this.getRouterObject().get('/board_state', this.getBoardState);
        this.getRouterObject().post('/figure_moves', this.boardClickRequestHandler);
        this.getRouterObject().post('/initial_player_data', this.getInitialPlayerData);
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
                activePlayer: undefined,
                activePlayerFiguresToMove: undefined
            }
            //move figure(change data) in board model
            this.getMainController().moveFigure(highlightedCell, coordinates);
            //change active player in game model
            this.getMainController().toggleActivePlayer();

            data.activePlayer = this.getMainController().getActivePlayer();
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