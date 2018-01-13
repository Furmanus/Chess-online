/**
 * @author Lukasz Lach
 */

class Page{

    /**
     * Hides HTML element by adding "hidden" class.
     * @param {HTMLElement} element
     */
    hideElement(element){

        this.addClass(element, 'hidden');
    }
    /**
     * Shows HTML element on screen by removing its "hidden" class.
     * @param {HTMLElement} element
     */
    showElement(element){

        this.removeClass(element, 'hidden');
    }
    /**
     * Method responsible for disabling HTML element.
     * @param {HTMLElement} element
     */
    disableElement(element){

        element.setAttribute('disabled', 'disabled');
    }
    /**
     * Method responsible for enabling HTML element.
     * @param {HTMLElement} element
     */
    enableElement(element){

        if(element.hasAttribute('disabled')) {

            element.removeAttribute('disabled');
        }
    }
    /**
     * Method responsible for disabling buttons on page. Can be overriden in certain pages objects.
     */
    disableButtons(){

        const buttons = document.querySelectorAll('input[type=button]');

        buttons.forEach(function(buttonItem){

            this.disableElement(buttonItem);
        }.bind(this));
    }
    /**
     * Method responsible for enabling buttons on page. Can be overriden in certain pages objects.
     */
    enableButtons(){

        const buttons = document.querySelectorAll('input[type=button]');

        buttons.forEach(function(buttonItem){

            this.enableElement(buttonItem);
        }.bind(this));
    }
    /**
     * Method responsible for adding class to HTML element classlist.
     * @param {HTMLElement} element
     * @param {string}      className
     */
    addClass(element, className){

        if(element && element.classList && element.classList.add) {

            element.classList.add(className);
        }
    }
    /**
     * Method responsible for removing class from HTML element classlist.
     * @param {HTMLElement} element
     * @param {string}      className
     */
    removeClass(element, className){

        if(element && element.classList.contains(className)){

            element.classList.remove(className);
        }
    }
}

export default Page;