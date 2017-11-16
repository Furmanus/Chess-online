/**
 * @author Lukasz Lach
 */

const figure = Symbol();
const owner = Symbol();

/**
 * @class
 * @typedef {Object} CellModel
 */
class CellModel{

    /**
     * Constructor for board cell model.
     * @param {string|null} figureString    Name (string) of figure in this cell or null.
     * @param {string|null} ownerString     Name (string, black or white) of owner of figure in this cell.
     */
    constructor(figureString, ownerString){

        /**
         * @private
         * @type      {string|null}
         */
        this[figure] = figureString;
        /**
         * @private
         * @type      {string|null}
         */
        this[owner] = ownerString;
    }

    /**
     * Returns figure in this cell.
     * @returns {string|null}
     */
    getFigure(){

        return this[figure];
    }

    /**
     * Sets new figure (or removes currently existing one) in this cell. Returns cell model instance (for chaining purposes).
     * @param {string|null} figureString
     * @return {CellModel}
     */
    setFigure(figureString){

        this[figure] = figureString;
        return this;
    }

    /**
     * Returns owner of figure in this cell.
     * @returns {string|null}
     */
    getOwner(){

        return this[owner];
    }

    /**
     * Sets new owner of figure in this cell. Returns cell model instance (for chaining purposes).
     * @param {string|null} ownerString
     * @return {CellModel}
     */
    setOwner(ownerString){

        if(!this.getFigure()){

            throw new Error(`Can't set owner of cell which doesn't contain any figure.`);
        }

        this[owner] = ownerString;
        return this;
    }
}

module.exports = CellModel;