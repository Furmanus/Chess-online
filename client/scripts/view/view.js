/**

 @author Lukasz Lach
 */

import PanelView from "./panel/panel_view";
import BoardView from "./board/board_view";
import Observer from "../core/observer";

// private variables declaration
const boardView = Symbol('boardView');
const panelView = Symbol('panelView');

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

        /**
         * @private
         * @type {BoardView}
         */
        this[boardView] = null;
        /**
         * @private
         * @type {PanelView}
         */
        this[panelView] = null;

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