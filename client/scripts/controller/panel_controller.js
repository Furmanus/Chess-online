/**@author Lukasz Lach*/

//private variables declaration
const panelView = Symbol();

/**
 * Controller responsible for taking user input from panel, passing it to model and manipulating view.
 * @class
 * @typedef {Object} PanelController
 */
class PanelController{

    /**
     * Constructor for panel controller.
     * @param {PanelView} panelViewObject
     */
    constructor(panelViewObject){

        this[panelView] = panelViewObject;
    }

    /**
     * Returns PanelView object.
     * @returns {PanelView}
     */
    getPanelView(){

        return this[panelView];
    }
}

export default PanelController;