/**@author Lukasz Lach*/

import HighlightEnums from "../../../../enums/highlight";

//private variables of Cell class
const parent = Symbol('parent');
const element = Symbol('element');
const figure = Symbol('figure');
const x = Symbol('x');
const y = Symbol('y');

/**
 * Class representing single cell in game board.
 * @class
 * @typedef {Object} Cell
 */
class Cell{

    /**
     * Constructor for Cell class.
     * @constructor
     * @param {number} xCoordinate Row (horizontal) coordinate of cell.
     * @param {number} yCoordinate Column (vertical) coordinate of cell.
     * @param {HTMLElement} parentElement HTML Element to which created board cell will be appended.
     */
    constructor(xCoordinate, yCoordinate, parentElement){

        /**@type {number}*/
        this[x] = xCoordinate;

        /**@type {number}*/
        this[y] = yCoordinate;
        /**
         * @private
         * @type {HTMLElement}
         */
        this[parent] = parentElement;
        /**
         * @private
         * @type {null|Figure}
         */
        this[figure] = null;
        /**
         * @type {HTMLElement}
         * @private
         */
        this[element] = document.createElement('div');
        /**
         * @type {boolean|string}
         */
        this.isHighlighted = false;

        this.initialize();
    }

    /**
     * Method which prepares HTMLElement and appends it to game board.
     * @returns {undefined}
     */
    initialize(){

        this.addClass('cell');

        this.setPosition(this.getX() * 53, this.getY() * 53);
        //we set special attribute to html element, so later click event listener could retrieve with those coordinates this cell object.
        this.getElement().setAttribute('data-coordinates', `${this.getX()}x${this.getY()}`);

        this.setBackgroundColor();

        this.getParent().appendChild(this.getElement());
    }

    /**
     * Sets element background color (by adding proper css class) depending on its coordinates.
     * @returns {undefined}
     */
    setBackgroundColor(){

        if(this.getX() % 2 === this.getY() % 2){

            this.addClass('cell_white');
        }else{

            this.addClass('cell_black');
        }
    }

    /**
     * Sets figure object in this cell.
     * @param {Figure} figureObject
     */
    setFigure(figureObject){

        this[figure] = figureObject;
    }
    /**
     * Removes figure from certain html board cell.
     */
    removeFigure(){

        const figure = this.getFigure();

        if(figure) {
            try {
                //sprawdzić czemu tu czasami rzuca dziwnym błędem, że element usuwany nie jest dzieckiem tego noda
                this[element].removeChild(figure.getElement());
            }catch (err){
                console.warn('Unexpected error while removing figure');
            };
        }
    }
    /**
     * Returns figure from this cell.
     * @return {Figure/null}
     */
    getFigure(){

        return this[figure];
    }
    /**
     * Returns HTMLElement appended to game board.
     * @returns {HTMLElement}
     */
    getElement(){

        return this[element];
    }

    /**
     * Returns HTMLElement parent element of this board cell.
     * @returns {HTMLElement}
     */
    getParent(){

        return this[parent];
    }

    /**
     * Sets css class of element.
     * @param {string} className Name of css class to add.
     * @returns {undefined}
     */
    addClass(className){

        this.getElement().classList.add(className);
    }

    /**
     * Removes css class of element.
     * @param {string} className Name of css class to remove.
     * @returns {undefined}
     */
    removeClass(className){

        this.getElement().classList.remove(className);
    }

    /**
     * Sets absolute left and top position (relative to game board left-top edge).
     * @param {number} left Left css style position.
     * @param {number} top Top css style position.
     * @returns {undefined}
     */
    setPosition(left, top){

        this.getElement().style.left = left + 'px';
        this.getElement().style.top = top + 'px';
    }

    /**
     * Highlights cell (sets border with certain colour, from HighlightColour enums).
     * @param {string} colour Colour of cell border.
     * @returns {undefined}
     */
    highlightCell(colour) {

        if (!Object.values(HighlightEnums).includes(colour)) {

            throw new Error('Invalid colour for cell to highlight');
        }
        if(this.isHighlighted){

            return;
        }

        this.addClass(colour + '_border');
        this.isHighlighted = colour;
    }

    /**
     * Removes highlight border of cell.
     * @returns {undefined}
     */
    removeHighlightCell(){

        if(this.isHighlighted){

            this.removeClass(this.isHighlighted + '_border');
            this.isHighlighted = false;
        }
    }

    /**
     * Getter for horizontal position of cell on game board.
     * @returns {number} Horizontal position of cell on game board.
     */
    getX(){

        return this[x];
    }

    /**
     * Getter for vertical position of cell on game board.
     * @returns {number} Vertical position of cell on game board.
     */
    getY(){

        return this[y];
    }
}

export default Cell;