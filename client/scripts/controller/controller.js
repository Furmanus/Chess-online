/**@author Lukasz Lach*/

import BoardController from "./board_controller";
import PanelController from "./panel_controller";
import ColourEnums from "../../../enums/colours";
import EventEnums from "./../../../enums/events";
import View from "../view/view";
import SocketClientManager from "../helper/socket_manager";
import Observer from "../../../core/observer";
import Ajax from "../helper/ajax";
import GameModel from "../model/client_game_model";

// declarations of class private fields
const mainView = Symbol();
const boardController = Symbol();
const panelController = Symbol();
const socketClientManager = Symbol();
const gameModel = Symbol();

/**
 * Main controller of application.
 * @typedef {Object} MainController
 */
class MainController extends Observer{

    constructor(){
        super();

        /**@type {View}*/
        this[mainView] = new View();
        /**@type {SocketClientManager}*/
        this[socketClientManager] = new SocketClientManager();
        /**@type {GameModel}*/
        this[gameModel] = new GameModel();
        /**@type {BoardController}*/
        this[boardController] = new BoardController(this.getMainView().getBoardView(), this.getSocketClientManager(), this.getGameModel());
        /**@type {PanelController}*/
        this[panelController] = new PanelController(this.getMainView().getPanelView(), this.getSocketClientManager());

        this.fetchPlayerDataFromServer = this.fetchPlayerDataFromServer.bind(this);
        this.onPlayerMoveReady = this.onPlayerMoveReady.bind(this);
        this.onGameReady = this.onGameReady.bind(this);

        this.initialize();
    }

    /**
     * Method responsible for initializing main game controller.
     */
    initialize(){

        this.getSocketClientManager().on(this, EventEnums.SOCKET_CONNECTION_ESTABLISHED, this.fetchPlayerDataFromServer);
        this.getSocketClientManager().on(this, EventEnums.CLIENT_NOTIFY_MOVE_READY, this.onPlayerMoveReady);
        this.getSocketClientManager().on(this, EventEnums.BOTH_PLAYERS_READY, this.onGameReady);
    }
    /**
     * Method responsible for initializing game after receiving message from server that both players are ready.
     */
    onGameReady(){

        this.getPanelController().addMessageInView('Both players are ready! White starts the game.');
    }
    /**
     * Method responsible for sending initial AJAX post request to server.
     */
    fetchPlayerDataFromServer(){

        const socketId = this.getSocketClientManager().getSocketId();

        Ajax.post('/initial_player_data', {id: socketId}).then(function(data){

            Ajax.validateAjaxResponseRedirect(data);

            this.getGameModel().setPlayerColour(data.colour);

            if(data.colour === ColourEnums.WHITE){

                this.getBoardController().listenToViewEvents();
            }
        }.bind(this)).catch(function(error){

            console.error(error);
        }.bind(this));
    }
    /**
     * Method triggered after controller being notified by socket manager that one player made his move.
     * @param {Object}  data
     * TODO uzupełnic resztę
     */
    onPlayerMoveReady(data){

        const fromString = `${data.sourceCoords.x + 1}x${data.sourceCoords.y + 1}`;
        const targetString = `${data.targetCoords.x + 1}x${data.targetCoords.y + 1}`;

        if(data.activePlayer === this.getGameModel().getPlayerColour()){

            this.getBoardController().listenToViewEvents();
            this.getBoardController().highlightFiguresAbleToMoveInView(data.activePlayerFiguresToMove);
        }else{

            this.getBoardController().detachEventsInView();
        }

        this.getBoardController().moveFigure(data.sourceCoords, data.targetCoords);
        this.getPanelController().addMessageInView(`${data.previousPlayer} player moved ${data.movedFigure} from ${fromString} to ${targetString}.`);

        if(data.capturedFigure){
            
            this.getPanelController().addMessageInView(`${data.previousPlayer} player captured ${data.activePlayer} player's ${data.capturedFigure}!`);
        }
    }
    /**
     * Returns board controller.
     * @returns {BoardController} Board controller object.
     */
    getBoardController(){
        return this[boardController];
    }
    /**
     * Returns panel controller.
     * @returns {PanelController} Panel controller object.
     */
    getPanelController(){
        return this[panelController];
    }
    /**
     * Returns socket manager for client side.
     * @returns {SocketClientManager}   SocketClientManager instance.
     */
    getSocketClientManager(){
        return this[socketClientManager];
    }
    /**
     * Returns main view attached to main controller.
     * @returns {View} Main View object.
     */
    getMainView(){
        return this[mainView];
    }
    /**
     * Returns game model.
     * @returns {GameModel}
     */
    getGameModel(){
        return this[gameModel];
    }

}

export default MainController;