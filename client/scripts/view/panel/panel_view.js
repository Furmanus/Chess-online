/**@author Lukasz Lach*/

import Observer from "../../../../core/observer";

const panelElement = Symbol();
const listElement = Symbol();

/**
 * @class
 * @typedef {Object} PanelView
 */
class PanelView extends Observer{

    /**
     * @constructor
     */
    constructor(){

        super();

        /**@type {HTMLDivElement*/
        this[panelElement] = document.getElementById('panel');
        /**@type {HTMLUListElement}*/
        this[listElement] = document.querySelector('.messages');
    }
    /**
     * Method responsible for displaying message in side panel.
     * @param {string}  message
     */
    addMessage(message){

        const messageElement = document.createElement('li');
        const listElement = this.getListElement();
        const panelElement = this.getPanelElement();

        messageElement.textContent = message;
        listElement.appendChild(messageElement);
        panelElement.scrollTop = listElement.scrollHeight;
    }
    /**
     * Returns HTML panel DIV element.
     * @returns {HTMLDivElement}
     */
    getPanelElement(){

        return this[panelElement];
    }
    /**
     * Returns HTML unordered list element.
     * @returns {HTMLUListElement}
     */
    getListElement(){

        return this[listElement];
    }
}

export default PanelView;