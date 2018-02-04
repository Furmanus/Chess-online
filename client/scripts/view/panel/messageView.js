/**
 * @author Lukasz Lach
 */
import Observer from '../../../../core/observer';
import EventEnums from '../../../../enums/events';

const messageElement = Symbol();

/**
 * @class
 * @typedef PanelMessageView
 */
class PanelMessageView extends Observer{
    /**
     * @constructor
     */
    constructor(isLink){

        super();
        /**@type {HTMLListItemElement}*/
        this[messageElement] = document.createElement('li');

        this.attachEvents(isLink);
    }
    /**
     * Method responsible for attaching event listener to message list item element.
     */
    attachEvents(isLink){

        this.getMessageListElement().addEventListener('click', this.onMessageClick.bind(this));

        if(isLink){

            this.getMessageListElement().addEventListener('mouseenter', this.onMessageMouseEnter.bind(this));
            this.getMessageListElement().addEventListener('mouseleave', this.onMessageMouseLeave.bind(this));
        }
    }
    /**
     * Method triggered after mouse leaves message list item element.
     */
    onMessageMouseEnter(){

        this.getMessageListElement().classList.add('hover');
    }
    /**
     * Method triggered after mouse enters message list item element.
     */
    onMessageMouseLeave(){

        this.getMessageListElement().classList.remove('hover');
    }
    /**
     * Sets text content of panel message html list item element.
     * @param {string}  messageText
     */
    addMessageTextContent(messageText){

        const htmlListElement = this[messageElement];

        this[messageElement].textContent = messageText;
        this.notify(EventEnums.PANEL_MESSAGE_CREATED, {element: htmlListElement});
    }
    /**
     * Method called after user clicks message list item element.
     */
    onMessageClick(){

        this.notify(EventEnums.PANEL_MESSAGE_CLICK);
    }
    /**
     * Returns html list item element.
     * @returns {HTMLListItemElement}}
     */
    getMessageListElement(){

        return this[messageElement];
    }
}

export default PanelMessageView;