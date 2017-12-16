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