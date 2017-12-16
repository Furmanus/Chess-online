/**
 * @author Lukasz Lach
 */

class DomHelper{

    /**
     * Clears HTML DOM element from its childrens
     * @param {HTMLElement} element
     */
    static clearElementChildrens(element){

        while(element.hasChildNodes()){

            element.removeChild(element.firstChild);
        }
    }
}

export default DomHelper;