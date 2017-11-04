/**@author Lukasz Lach*/

//private variables declaration
const panelView = Symbol();
const socketClientManager = Symbol();

/**
 * Controller responsible for taking user input from panel, passing it to model and manipulating view.
 * @class
 * @typedef {Object} PanelController
 */
class PanelController{

    /**
     * Constructor for panel controller.
     * @param {PanelView}           panelViewObject
     * @param {SocketClientManager} socketClientManagerInstance
     */
    constructor(panelViewObject, socketClientManagerInstance){

        this[panelView] = panelViewObject;

        this[socketClientManager] = socketClientManagerInstance;
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
}

export default PanelController;