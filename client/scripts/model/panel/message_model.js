/**
 * @author Lukasz Lach
 */
import Observer from '../../../../core/observer';

const messageText = Symbol();
const messageMovementData = Symbol();

/**
 * Class for model of panel message.
 * @class
 * @typedef PanelMessageModel
 */
class PanelMessageModel extends Observer{

    /**
     * @constructor
     * @param {string}  panelMessageText
     */
    constructor(panelMessageText){

        super();

        /**@type {string}*/
        this[messageText] = panelMessageText || '';
        /**@type {Object}*/
        this[messageMovementData];
    }
    /**
     * Method responsible for returning panel message text content.
     * @returns {string}
     */
    getMessageText(){

        return this[messageText];
    }
    /**
     * Returns messave movement data containing board state after movement and source and target move coordinates.
     * @returns {Object}
     */
    getMessageMovementData(){

        return this[messageMovementData]
    }
    /**
     * Sets messageMovementData field.
     * @param {Object}   newMessageMovementData
     */
    setMessageMovementData(newMessageMovementData){

        this[messageMovementData] = newMessageMovementData;
    }
}

export default PanelMessageModel;