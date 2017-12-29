/**
 * @author Lukasz Lach
 */

const growlerElement = Symbol();
const growlerInterval = Symbol();
const growlerContainer = Symbol();
const message = Symbol();

const growlers = new Set();

/**
 * @class
 */
class Growler{

    /**
     * @constructor
     * @param {string}  growlerMessage
     */
    constructor(growlerMessage){

        /**@type {HTMLDivElement}*/
        this[growlerContainer] = document.querySelector('.growler-container');
        /**@type {HTMLDivElement}*/
        this[growlerElement] = document.createElement('div');
        /**@type {number}*/
        this[growlerInterval] = null;
        /**@type {string}*/
        this[message] = growlerMessage;

        this.initialize();
    }
    /**
     * Method responsible for growler initialization.
     */
    initialize(){

        this[growlerElement].classList.add('growler');
        this[growlerElement].textContent = this[message];

        this[growlerContainer].appendChild(this[growlerElement]);
        growlers.add(this);

        window.setInterval(this.initializeFadeout.bind(this), 4000);
    }
    /**
     * Method responsible for removing growler from DOM.
     */
    destroy(){

        window.clearInterval(this[growlerInterval]);
        this[growlerContainer].removeChild(this[growlerElement]);

        if(growlers.has(this)){

            growlers.delete(this);
        }
    }
    /**
     * Initializes fadeout animation.
     */
    initializeFadeout(){

        this[growlerInterval] = window.setInterval(this.fadeout.bind(this), 5);
    }
    /**
     * Method responsible for fadeout animation. Moves growler down by 1px untill its upper border is beyond document bottom border.
     */
    fadeout(){

        const elementHeightRelativeToDocument = this[growlerElement].offsetTop + this[growlerContainer].offsetTop;

        this[growlerElement].style.top = parseInt(window.getComputedStyle(this[growlerElement]).top) + 1 + 'px';

        if(elementHeightRelativeToDocument > document.body.offsetHeight){

            this.destroy();
        }
    }
    static get growlers(){

        return growlers;
    }
}

export default Growler;