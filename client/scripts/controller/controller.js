/**@author Lukasz Lach*/

import BoardController from "./board_controller";
import PanelController from "./panel_controller";
import View from "../view/view";

// declarations of class private fields
const mainView = Symbol();
const boardController = Symbol();
const panelController = Symbol();

/**
 * Main controller of application.
 * @class
 * @typedef {Object} MainController
 */
class MainController{

    /**
     * Constructor of main controller
     */
    constructor(){

        /**
         * @type {View}
         * @private
         */
        this[mainView] = new View();

        /**
         * @type {BoardController}
         * @private
         */
        this[boardController] = new BoardController(this.getMainView().getBoardView());

        /**
         * @type {PanelController}
         * @private
         */
        this[panelController] = new PanelController(this.getMainView().getPanelView());
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
     * Returns main view attached to main controller.
     * @returns {View} Main View object.
     */
    getMainView(){

        return this[mainView];
    }
}

export default MainController;