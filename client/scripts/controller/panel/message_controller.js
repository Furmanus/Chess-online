/**
 * @author Lukasz Lach
 */
import PanelMessageModel from '../../model/panel/message_model';
import PanelMessageView from '../../view/panel/messageView';
import Observer from '../../../../core/observer';
import EventEnums from '../../../../enums/events';
import BoardHelper from "../../helper/board_helper";

const panelMessageModel = Symbol();
const panelMessageView = Symbol();

/**
 * Controller for single message visible in panel.
 * @class
 * @typedef PanelMessageController
 */
class PanelMessageController extends Observer{

    constructor(messageText, moveData, isLink){

        super();

        /**@type {PanelMessageModel}*/
        this[panelMessageModel] = new PanelMessageModel(messageText);
        /**@type {PanelMessageView}*/
        this[panelMessageView] = new PanelMessageView(isLink);

        this.initialize(moveData);
        this.attachEvents();
    }
    /**
     * Method responsible for initialization of controller.
     */
    initialize(moveData){

        this.getPanelMessageView().addMessageTextContent(this.getPanelMessageModel().getMessageText());

        if(moveData) {

            this.setPreviousBoardStateFromCurrent(moveData);
        }
    }
    /**
     * Method responsible for attaching events to panel controller.
     */
    attachEvents(){

        this.getPanelMessageView().on(this, EventEnums.PANEL_MESSAGE_CREATED, this.onMessageCreation.bind(this));
        this.getPanelMessageView().on(this, EventEnums.PANEL_MESSAGE_CLICK, this.onMessageClick.bind(this));
    }
    /**
     * Callback method triggered after panel message has been initialized and attached text content.
     */
    onMessageCreation(data){

        this.notify(EventEnums.PANEL_MESSAGE_ATTACH_READY, data);
    }
    /**
     * Callback message triggered after panel message view notified that list message element was clicked by user.
     */
    onMessageClick(){

        const movementData = this.getPanelMessageModel().getMessageMovementData();

        if(movementData) {

            this.notify(EventEnums.PANEL_MESSAGE_CLICK, movementData);
        }
    }
    /**
     * Method returns previous board state from current board state and movement data.
     * @param {Object}  moveData
     */
    setPreviousBoardStateFromCurrent(moveData){

        const previousBoardStateData = BoardHelper.getPreviousBoardState(moveData);

        this.getPanelMessageModel().setMessageMovementData(previousBoardStateData);
    }
    /**
     * Returns panel message html list item element.
     * @returns {HTMLListItemElement}
     */
    getPanelMessageListElement(){

        return this.getPanelMessageView().getMessageListElement();
    }
    /**
     * Returns unique message id from model.
     * @returns {string}
     */
    getPanelMessageId(){

        return this.getPanelMessageModel().getMessageId();
    }
    /**
     * Returns panel message model instance;
     * @returns {PanelMessageModel}
     */
    getPanelMessageModel(){

        return this[panelMessageModel];
    }
    /**
     * Returns panel message view instance;
     * @returns {PanelMessageView}
     */
    getPanelMessageView(){

        return this[panelMessageView];
    }
}

export default PanelMessageController;