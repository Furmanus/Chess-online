/**@author Lukasz Lach*/

import BoardController from "./board_controller";
import PanelController from "./panel_controller";
import View from "../view/view";
import SocketClientManager from "../helper/socket_manager";
import Observer from "../../../core/observer";
import Ajax from "../helper/ajax";

// declarations of class private fields
const mainView = Symbol();
const boardController = Symbol();
const panelController = Symbol();
const socketClientManager = Symbol();

/**
 * Main controller of application.
 * @class
 * @typedef {Object} MainController
 */
class MainController extends Observer{

    /**
     * Constructor of main controller
     */
    constructor(){

        super();

        /**
         * @type {View}
         * @private
         */
        this[mainView] = new View();

        /**
         * @type {SocketClientManager}
         * @private
         */
        this[socketClientManager] = new SocketClientManager();

        /**
         * @type {BoardController}
         * @private
         */
        this[boardController] = new BoardController(this.getMainView().getBoardView(), this.getSocketClientManager());

        /**
         * @type {PanelController}
         * @private
         */
        this[panelController] = new PanelController(this.getMainView().getPanelView(), this.getSocketClientManager());
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
}

export default MainController;