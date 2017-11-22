/**@author Lukasz Lach*/

import FigureEnums from '../../../../enums/figures';
import ColourEnums from "../../../../enums/colours";
import Utility from "../../helper/algorithms";

// private variables declaration
const type = Symbol();
const colour = Symbol();
const element = Symbol();
const parentElement = Symbol();


/**
 * Class representing view of game figures.
 * @class
 * @typedef {Figure}
 */
class Figure{

    /**
     * Constructor of Figure class.
     * @constructor
     * @param {string} figureType Type of figure. String which is member of FigureEnums object.
     * @param {string} figureColour Colour of figure. String which is member of ColourEnums object.
     * @param {HTMLElement} FigureParentElement HTML Element to which created object will be apended.
     */
    constructor(figureType, figureColour, FigureParentElement){

        if(!Object.values(FigureEnums).includes(figureType)){

            throw new Error('Invalid figure type');
        }
        if(!Object.values(ColourEnums).includes(figureColour)){

            throw new Error('Invalid figure colour');
        }

        /**@type {string}*/
        this[type] = figureType;
        /**@type {string}*/
        this[colour] = figureColour;
        /**@type {HTMLElement}*/
        this[parentElement] = FigureParentElement;
        /**@type {HTMLElement}*/
        this[element] = null;

        this.initialize();
    }

    /**
     * Creates HTML Element and appends it to proper cell HTML Element.
     * @returns {undefined}
     */
    initialize(){

        this[element] = document.createElement('div');

        this.getElement().classList.add('figure');
        this.getElement().classList.add(this.getType() + '_' + this.getColour());

        this.getParentElement().appendChild(this.getElement());
    }

    /**
     * Returns HTML Element representing figure.
     * @returns {HTMLElement} Returns HTML Element representing figure.
     */
    getElement(){

        return this[element];
    }

    /**
     * Returns parent html element of figure.
     * @returns {HTMLElement} Returns parent element of figure.
     */
    getParentElement(){

        return this[parentElement];
    }

    /**
     * Sets parent html element of figure.
     * @param {HTMLElement} element HTML new parent element of figure.
     * @returns {undefined}
     */
    setParentElement(element){

        element.appendChild(this.getElement());
        this[parentElement] = element;
    }

    /**
     * Returns type of this figure.
     * @returns {string}
     */
    getType(){

        return this[type];
    }

    /**
     * Returns colour of this figure.
     * @returns {string} Returns colour of this figure.
     */
    getColour(){

        return this[colour];
    }

    /**
     * Moves figures from currently occupied cell to another cell.
     * @param {Cell} cell Destination cell.
     * @returns {undefined}
     */
    moveTo(cell){

        const convertedStartingPosition = this.getCoordinatesRelativeToBoard();
        const thisPositionX = convertedStartingPosition.x;
        const thisPositionY = convertedStartingPosition.y;
        /**
         * Element top left should be at center of HTML cell, because after appending it to target cell, transform: translate(-50%, -50%) CSS rule will be applied
         * */
        const targetPositionX = cell.getElement().offsetLeft + Math.floor(this.getElement().offsetWidth / 2);
        const targetPositionY = cell.getElement().offsetTop + Math.floor(this.getElement().offsetHeight / 2);

        /**
         * Remove element from its parent, and append it to game board. This is necessary, because later we want to modify its top and left properties, and they should be relative to
         * game board.
         */
        this.getParentElement().removeChild(this.getElement());
        this.setParentElement(cell.getElement().offsetParent);

        /**
         * We set elements left and top position as converted coordinates relative to board.
         */
        this.getElement().style.left = thisPositionX + 'px';
        this.getElement().style.top = thisPositionY + 'px';

        // Execute bresenham algorithm. Figure html element is moved along path from starting point to target point
        Utility.bresenham(thisPositionX, thisPositionY, targetPositionX, targetPositionY, 1, function(x, y){

            this.getElement().style.left = x + 'px';
            this.getElement().style.top = y + 'px';

            // when target point is reached
            if(x === targetPositionX && y === targetPositionY){

                // We check if new cell has any figures, if yes, we remove them.
                if(cell.getElement().children.length && cell.getElement().firstElementChild.classList.contains('figure')){

                    cell.getElement().removeChild(cell.getElement().firstChild);
                }

                // figure html element is removed from board html element, and appended to target cell
                this.getParentElement().removeChild(this.getElement());
                this.setParentElement(cell.getElement());

                // We set figure element top and left to previous values
                this.getElement().style.left = '50%';
                this.getElement().style.top = '50%';
            }
        }.bind(this))
    }

    /**
     * Returns coordinates of HTML Element representing figure relative to game board.
     * @returns {{x: number, y: number}} Returns coordinates of HTML Element representing figure relative to game board.
     */
    getCoordinatesRelativeToBoard(){

        const x = this.getElement().offsetLeft + this.getParentElement().offsetLeft;
        const y = this.getElement().offsetTop + this.getParentElement().offsetTop;

        return {x: x, y: y}
    }
}

export default Figure;