/**

 @author Lukasz Lach
 */

import PanelView from "./panel/panel_view";
import BoardView from "./board/board_view";
import Observer from "../../../core/observer";

// private variables declaration
const boardView = Symbol('boardView');
const panelView = Symbol('panelView');
const whitePlayerHeader = Symbol('white');
const blackPlayerHeader = Symbol('black');

/**
 * Class representing main view.
 * @class
 * @typedef {Object} View
 */
class View extends Observer{

    /**
     * Constuctor for main view object.
     * @constructor
     */
    constructor(){

        super();

        /**@type {BoardView}*/
        this[boardView] = null;
        /**@type {PanelView}*/
        this[panelView] = null;
        /**@type {HTMLSpanElement}*/
        this[whitePlayerHeader] = document.querySelector('#white span');
        /** {HTMLSpanElement}*/
        this[blackPlayerHeader] = document.querySelector('#black span');

        this.initialize();
    }

    /**
     * Method which initializes main view object.
     * @returns {undefined}
     */
    initialize(){

        this[boardView] = new BoardView();
        this[panelView] = new PanelView();
    }
    /**
     * Method responsible for setting player online status in page header.
     * @param {Object}  data            Data received from client who logged into game board page.
     * @param {string}  data.colour     Colour of player.
     */
    setPlayerOnline(data){

        if(!data.colour){

            return;
        }

        const playerHeader = data.colour === 'white' ? this[whitePlayerHeader] : this[blackPlayerHeader];

        if(playerHeader.classList.contains('offline')){

            playerHeader.classList.remove('offline');
            playerHeader.textContent = '';
        }

        playerHeader.classList.add('online');
        playerHeader.textContent = 'online';
    }
    /**
     * Method responsible for setting player offline status in page header.
     * @param {Object}  data    Data received from client who logged into game board page.
     */
    setPlayerOffline(data){

        const playerHeader = data.colour === 'white' ? this[whitePlayerHeader] : this[blackPlayerHeader];

        if(playerHeader.classList.contains('online')){

            playerHeader.classList.remove('online');
            playerHeader.textContent = '';
        }

        playerHeader.classList.add('offline');
        playerHeader.textContent = 'offline';
    }
    /**
     * Method which returns BoardView instance.
     * @returns {BoardView}
     */
    getBoardView(){

        return this[boardView];
    }

    /**
     * Method which returns PanelView instance.
     * @returns {PanelView}
     */
    getPanelView(){

        return this[panelView];
    }
}

export default View;