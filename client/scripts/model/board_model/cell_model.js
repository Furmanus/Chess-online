/**
 * @author Lukasz Lach
 */

const figure = Symbol();
const x = Symbol();
const y = Symbol();

/**
 * @class
 * @typedef {Object} CellModel
 */
class CellModel{

    /**
     * Constructor for board cell model.
     * @param {number}      x               Horizontal coordinate of cell.
     * @param {number}      y               Vertical coordinate of cell.
     * @param {Figure|null} figureObject    Figure object in this cell or null.
     */
    constructor(xCoordinate, yCoordinate, figureObject){

        /**@type {Figure|null}*/
        this[figure] = figureObject;
        /**@type {number}*/
        this[x] = xCoordinate;
        /**@type {number}*/
        this[y] = yCoordinate;
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
    /**
     * Returns coordinates object of cell.
     * @returns {{x: number, y: number}}
     */
    getCoordinates(){

        return {

            x: this[x],
            y: this[y]
        }
    }
}

export default CellModel;