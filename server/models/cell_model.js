/**
 * @author Lukasz Lach
 */

const figure = Symbol();

/**
 * @class
 * @typedef {Object} CellModel
 */
class CellModel{

    /**
     * Constructor for board cell model.
     * @param {Figure|null} figureObject    Figure object in this cell or null.
     */
    constructor(figureObject){

        /**
         * @private
         * @type      {Figure|null}
         */
        this[figure] = figureObject;
    }
    /**
     * Returns figure in this cell.
     * @returns {Figure|null}
     */
    getFigure(){

        return this[figure];
    }
    /**
     * Sets new figure (or removes currently existing one) in this cell. Returns cell model instance (for chaining purposes).
     * @param {Figure|null} figureObject
     * @return {CellModel}
     */
    setFigure(figureObject){

        this[figure] = figureObject;
        return this;
    }
    /**
     * Removes figure from cell.
     */
    removeFigure(){

        this[figure] = null;
    }
}

module.exports = CellModel;