/**@author Lukasz Lach*/

import BoardController from "./board_controller";
import PanelController from "./panel_controller";
import ColourEnums from "../../../enums/colours";
import FigureEnums from "../../../enums/figures";
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

    /**
     * Constructor for main controller.
     * @param {Object}  initialData     Object with game data.
     * @param {string}  id              Unique game id from database.
     * @param {string}  user            User name.
     */
    constructor(initialData){
        super();

        /**@type {View}*/
        this[mainView] = new View();
        /**@type {SocketClientManager}*/
        this[socketClientManager] = new SocketClientManager();
        /**@type {GameModel}*/
        this[gameModel] = new GameModel(initialData);
        /**@type {BoardController}*/
        this[boardController] = new BoardController(this.getMainView().getBoardView(), this.getSocketClientManager(), this.getGameModel());
        /**@type {PanelController}*/
        this[panelController] = new PanelController(this.getMainView().getPanelView(), this.getSocketClientManager());

        this.initialize();
        this.attachEvents();
    }

    /**
     * Method responsible for initializing main game controller.
     */
    initialize(){

    }
    /**
     * Method responsible for listening on events.
     */
    attachEvents(){

        this.getSocketClientManager().on(this, EventEnums.SOCKET_CONNECTION_ESTABLISHED, this.fetchUserDataFromServer.bind(this));
        this.getSocketClientManager().on(this, EventEnums.CLIENT_NOTIFY_MOVE_READY, this.onPlayerMoveReady.bind(this));
        this.getSocketClientManager().on(this, EventEnums.SOCKET_TO_CONTROLLER_PLAYER_LOGIN, this.onPlayerLogin.bind(this));
        this.getSocketClientManager().on(this, EventEnums.SOCKET_TO_CONTROLLER_PLAYER_DISCONNECT, this.onPlayerDisconnect.bind(this));

        this.getBoardController().on(this, EventEnums.MOVE_READY_TO_SEND_SERVER, this.onMoveReadyToSendToServer.bind(this));
    }
    /**
     * Method responsible for sending to server information about player login to game board page.
     */
    sendToServerPlayerLogin(){

        const user = this.getGameModel().getUserName();

        this.getSocketClientManager().sendToServerPlayerOnline({user});
    }
    /**
     * Callback method called after receiving from server information about player login into game board page.
     * @param {Object}  data    Data received from player client who just logged into game board page.
     */
    onPlayerLogin(data){

        this.getMainView().setPlayerOnline(data);
    }
    /**
     * Callback method called after receiving from server information about player disconnecting from game board page.
     * @param {Object}  data    Data received from player client who just disconnected from game board page.
     */
    onPlayerDisconnect(data){

        this.getMainView().setPlayerOffline(data);
    }
    /**
     * Method responsible for sending initial AJAX post request to server.
     */
    fetchUserDataFromServer(){

        const user = this.getGameModel().getUserName();
        const gameId = this.getGameModel().getGameId();

        Ajax.post('/initial_player_data', {user, gameId}).then(function(data){

            const playerColour = data.colour;
            const opponentColour = data.opponentColour;
            const storedMessages = data.messages;
            let wasOpponentLoginStateSet = false;

            Ajax.validateAjaxResponseRedirect(data);

            this.getGameModel().setPlayerColour(playerColour);
            this.getGameModel().setOpponentColour(opponentColour)
            this.getGameModel().setActivePlayer(data.activePlayer);
            this.getBoardController().buildBoardModel(data.boardData);
            this.getBoardController().setBoardStateInView(data.boardData);
            storedMessages.forEach(function(message){

                this.getPanelController().addMessageInView(message)
            }.bind(this));
            this.getSocketClientManager().sendToServerPlayerOnline({

                user,
                gameId,
                colour: playerColour
            });

            if(data.hasEnded){

                this.getPanelController().addMessageInView(`Game is over.`);
                return;
            }

            this.getPanelController().addMessageInView(`Welcome! You are playing ${data.colour} pieces.`);
            if(playerColour === data.activePlayer){

                this.getPanelController().addMessageInView('It is your move now.');
                this.getBoardController().listenToViewEvents();
            }else{

                this.getPanelController().addMessageInView('It is your opponent move now.');
            }

            for(let user in data.users){

                if(data.users[user].colour) {

                    wasOpponentLoginStateSet = true;
                    this.getMainView().setPlayerOnline(data.users[user]);
                }
            }

            if(!wasOpponentLoginStateSet && opponentColour){

                this.getMainView().setPlayerOffline({colour: opponentColour});
            }
        }.bind(this)).catch(function(error){

            console.error(error);
        }.bind(this));
    }
    /**
     * Method responsible for sending information about move made by player to server. Triggered by board controller notifying move made by client.
     * @param {Object}  data        Object containing data about move made by player
     * @param {number}  sourceX     Horizontal coordinate of starting cell
     * @param {number}  sourceY     Vertical coordinate of starting cell
     * @param {number}  targetX     Horizontal coordinate of target cell
     * @param {number}  targetY     Vertical coordinate of target cell
     */
    onMoveReadyToSendToServer(data){

        const gameId = this.getGameModel().getGameId();
        const user = this.getGameModel().getUserName();
        const colour = this.getGameModel().getPlayerColour();
        const additionalData = {

            gameId,
            user,
            colour
        }

        Object.assign(data, additionalData);
        this.getSocketClientManager().sendPlayerMoveToServer(data);
    }
    /**
     * Method triggered after controller being notified by socket manager that one player made his move.
     * @param {Object}  data
     */
    onPlayerMoveReady(data){

        const gameId = this.getGameModel().getGameId();
        const fromString = `${data.sourceX + 1}x${data.sourceY + 1}`;
        const targetString = `${data.targetX + 1}x${data.targetY + 1}`;
        const previousPlayer = data.activePlayer === ColourEnums.WHITE ? ColourEnums.BLACK : ColourEnums.WHITE;
        let isActivePlayer;
        let message;
        let captureMessage;
        const moveModelData = this.getBoardController().moveFigure({

            x: data.sourceX,
            y: data.sourceY
        }, {
            x: data.targetX,
            y: data.targetY
        });

        message = `${previousPlayer} player moved ${moveModelData.figure} from ${fromString} to ${targetString}.`;

        this.getGameModel().setActivePlayer(data.activePlayer);

        isActivePlayer = data.activePlayer === this.getGameModel().getPlayerColour();

        if(isActivePlayer){

            this.getPanelController().addSavedMessageInView(gameId, message);
            this.getBoardController().listenToViewEvents();
        }else{

            this.getPanelController().addMessageInView(message);
            this.getBoardController().detachEventsInView();
        }

        if(moveModelData.capturedFigure === FigureEnums.KING){

            this.getPanelController().addMessageInView(`${previousPlayer} player captured ${data.activePlayer} player's king! ${previousPlayer} player is victorious! Game is over`);
            this.getBoardController().detachEventsInView();
            this.getSocketClientManager().sendToServerGameOver({gameId});
        }else if(moveModelData.capturedFigure){

            captureMessage = `${previousPlayer} player captured ${data.activePlayer} player's ${moveModelData.capturedFigure}!`;

            if(isActivePlayer) {

                this.getPanelController().addSavedMessageInView(gameId, captureMessage);
            }else{

                this.getPanelController().addMessageInView(captureMessage);
            }
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