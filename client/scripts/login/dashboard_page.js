/**
 * @author Lukasz Lach
 */

import Ajax from './../helper/ajax';
import Page from './page';

const gamesListElement = Symbol();
const user = Symbol();
const loaderElement = Symbol();
const mainPageElement = Symbol();
const serverMessagesElement = Symbol();
const logoutInputElement = Symbol();

/**
 * @class
 * @typedef {Object} DashboardPage
 */
class DashboardPage extends Page{

    /**@constructor*/
    constructor(){

        super();

        /**@type {HTMLElement}*/
        this[gamesListElement] = document.querySelector('.available_games ul');
        /**@type {string}*/
        this[user] = this.getUserNameFromUrl();
        /**@type {HTMLDivElement}*/
        this[loaderElement] = document.querySelector('.loader-container');
        /**@type {HTMLElement}*/
        this[mainPageElement] = document.querySelector('main');
        /**@type {HTMLElement*/
        this[serverMessagesElement] = document.querySelector('.available_games h3');
        /**@type {HTMLInputElement}*/
        this[logoutInputElement] = document.getElementById('logout');

        this.initialize();
        this.attachEvents();
    }
    initialize(){

        this.getGamesFromServer();
    }
    /**
     * Method responsible for attaching events for dashboard page html elements.
     */
    attachEvents(){

        this[logoutInputElement].addEventListener('click', this.logout.bind(this));
    }
    /**
     * Method responsible for retrieving user name from page url query.
     * @returns {string}
     */
    getUserNameFromUrl(){

        const url = window.location.href;

        return url.match(/\=(.*)/)[1];
    }
    /**
     * Method responsible for creating new HTML li element, adding content to it and appending to games list.
     * @param {Object]  element
     */
    addItemToGamesList(element){

        const li = document.createElement('li');
        const a = document.createElement('a');

        a.href = '/game';
        a.innerText = element.data;
        li.appendChild(a);
        this[gamesListElement].appendChild(li);
    }
    /**
     * Method responsible for fetching user ongoing games data from server and attaching each game to games list.
     */
    getGamesFromServer(){

        const user = this.getUser();
        const dashBoardPageObject = this;
        const hideLoader = this.hideLoader.bind(this);
        const showServerMessage = this.showServerMessage.bind(this);

        this.showLoader();

        Ajax.get('/games', {user}, true).then(function(data){

            Ajax.validateAjaxResponseRedirect(data);

            if(data.length) {

                data.forEach(function (element) {

                    dashBoardPageObject.addItemToGamesList(element);
                });
            }else{

                showServerMessage('Seems you have no ongoing games.')
            }

            hideLoader();
        });
    }
    /**
     * Method responsible for logging user out.
     */
    logout(){

        const user = this.getUser();

        Ajax.get('/logout', {user}, true).then(function(data){

            Ajax.validateAjaxResponseRedirect(data);
        });
    }
    /**
     * Method responsible for showing loader during asynchronous data fetching.
     */
    showLoader(){

        const loader = this.getLoaderElement();

        this.addClass(this.getMainElement(), 'transparent');
        this.showElement(loader);
    }
    /**
     * Method responsible for hiding loader.
     */
    hideLoader(){

        const loader = this.getLoaderElement();

        this.removeClass(this.getMainElement(), 'transparent');
        this.hideElement(loader);
    }
    /**
     * Displays message from server.
     * @param {string}  message
     */
    showServerMessage(message){

        this.getServerMessagesElement().textContent = message;
    }
    /**
     * Clears messages from server.
     */
    clearServerMessage(){

        this.getServerMessagesElement().textContent = '';
    }
    /**
     * Returns user name.
     * @returns {string}
     */
    getUser(){

        return this[user];
    }
    /**
     * Returns HTML games list element.
     * @returns {HTMLElement}
     */
    getGamesList(){

        return this[gamesListElement];
    }
    /**
     * Returns HTML loader div element.
     * @returns {HTMLDivElement}
     */
    getLoaderElement(){

        return this[loaderElement];
    }
    /**
     * Returns HTML main page section element.
     * @returns {HTMLElement}
     */
    getMainElement(){

        return this[mainPageElement];
    }
    /**
     * Returns HTML h3 element where messages from server should be displayed.
     * @returns {HTMLElement}
     */
    getServerMessagesElement(){

        return this[serverMessagesElement];
    }
}

export default DashboardPage;