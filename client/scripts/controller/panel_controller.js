/**@author Lukasz Lach*/
import Observer from "../../../core/observer";
import Ajax from "../helper/ajax";

//private variables declaration
const panelView = Symbol();
const socketClientManager = Symbol();

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
    constructor(panelViewObject, socketClientManagerInstance, gameModelInstance){

        super();

        this[panelView] = panelViewObject;
        this[socketClientManager] = socketClientManagerInstance;

        this.initialize();
    }
    /**
     * Initializes panel controller.
     */
    initialize(){


    }
    /**
     * Method responsible for adding message in panel view.
     * @param {string}  message
     */
    addMessageInView(message){

        this.getPanelView().addMessage(message);
    }
    /**
     * Method responsible for adding message in panel view and sending message to server to store it in database.
     * @param {string}  gameId
     * @param {string}  message
     */
    addSavedMessageInView(gameId, message){

        this.addMessageInView(message);
        Ajax.post('/save_message', {gameId, message}).then(function(data){

            if(data.result === 'failure'){

                console.error('failed to store message in database');
            }
        }.bind(this));
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
}

export default PanelController;