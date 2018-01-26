/**
 * @author Lukasz Lach
 */

import Templates from './../templates/templates';
import Growler from './growler';

class DomHelper{
    /**
     * Method responsible for capitalizing first text letter.
     * @param   {string}      text
     * @returns {string}    Modified string.
     */
    static capitalizeString(text){

        return text[0].toUpperCase() + text.substring(1);
    }
    /**
     * Clears HTML DOM element from its childrens
     * @param {HTMLElement} element
     */
    static clearElementChildrens(element){

        while(element.hasChildNodes()){

            element.removeChild(element.firstChild);
        }
    }
    /**
     * Method responsible for showing growler with message on screen. Growler is a small div with text appearing on fixed position on screen dissappearing after
     * 5 seconds.
     * @param   {string}    message     Message to show in growler.
     */
    static showGrowler(message){

        new Growler(message);
    }
    /**
     * Method responsible for removing all currently existing growlers from page.
     */
    static removeGrowlers(){

        Growler.growlers.forEach(function(growlerItem){

            growlerItem.destroy();
        });
    }
}

export default DomHelper;