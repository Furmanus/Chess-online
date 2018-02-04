/**@author Lukasz Lach*/
import Observer from "../../../core/observer";
import Ajax from "../helper/ajax";
import PanelMessageController from "../controller/panel/message_controller";
import EventEnums from "../../../enums/events";

//private variables declaration
const panelView = Symbol();
const socketClientManager = Symbol();
const registeredControllers = Symbol();

/**
 * Controller responsible for taking user input from panel, passing it to model and manipulating view.
 * @class
 * @typedef {Object} PanelController
 */
class PanelController extends Observer{

    /**
     * Constructor for panel controller.
     * @param {PanelView}           panelViewObject
     * @param {SocketClientManager} socketClientManagerInstance
     */
    constructor(panelViewObject, socketClientManagerInstance){

        super();

        this[panelView] = panelViewObject;
        this[socketClientManager] = socketClientManagerInstance;
        /**@type {Set}*/
        this[registeredControllers] = new Set();

        this.initialize();
    }
    /**
     * Initializes panel controller.
     */
    initialize(){

    }
    /**
     * Method responsible for adding message in panel view.
     * @param {string}  messageText
     * @param {Object}  moveData        Object containing data about movement
     * @param {boolean} isLink
     */
    addMessageInView(message, moveData, isLink){

        const createdController = new PanelMessageController(message, moveData, isLink);
        const createdMessageListItemElement = createdController.getPanelMessageListElement();

        this.getPanelView().addMessage(createdMessageListItemElement);
        this.registerMessageController(createdController);
    }
    /**
     * Method responsible for adding message in panel view and sending message to server to store it in database.
     * @param {string}  gameId
     * @param {string}  message
     * @param {boolean} isLink
     */
    addSavedMessageInView(gameId, message, moveData, isLink){
        this.addMessageInView(message, moveData, true);
        Ajax.post('/save_message', {gameId, message, moveData}).then(function(data){

            if(data.result === 'failure'){

                console.error('failed to store message in database');
            }
        }.bind(this));
    }
    /**
     * Method responsible for registering controller in Map object. Key is message unique id, value is message controller object.
     * @param {PanelMessageController}  messageController
     */
    registerMessageController(messageController){

        this.getRegisteredControllersMap().add(messageController);
        messageController.on(this, EventEnums.PANEL_MESSAGE_CLICK, this.onMessageClick.bind(this));
    }
    /**
     * Method triggered after one of message controllers notified about message being clicked in panel.
     * @param {Object}  data
     */
    onMessageClick(data){

        this.notify(EventEnums.PANEL_MESSAGE_CLICK, data);
    }
    /**
     * Returns PanelView object.
     * @returns {PanelView}
     */
    getPanelView(){

        return this[panelView];
    }
    /**
     * Returns socket manager for client side.
     * @returns {SocketClientManager}
     */
    getSocketClientManager(){

        return this[socketClientManager];
    }
    /**
     * Returns game model.
     * @returns {GameModel}
     */
    getGameModel(){

        return this[gameModel];
    }
    /**
     * Returns map with registered message controllers.
     * @returns {Set}
     */
    getRegisteredControllersMap(){

        return this[registeredControllers];
    }
}

export default PanelController;