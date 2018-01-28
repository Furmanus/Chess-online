/**
 * @author Lukasz Lach
 */

import Ajax from './../helper/ajax';
import Page from './page';
import Templates from './../templates/templates';
import DomHelper from './../helper/dom';

const gamesListElement = Symbol();
const user = Symbol();
const loaderElement = Symbol();
const mainPageElement = Symbol();
const serverMessagesElement = Symbol();
const logoutInputElement = Symbol();
const createInputElement = Symbol();
const sliderMenuElement = Symbol();
const warningParagraphElement = Symbol();

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
        /**@type {HTMLInputElement}*/
        this[createInputElement] = document.getElementById('create');
        /**@type {HTMLElement}*/
        this[sliderMenuElement] = document.querySelector('.slider-menu-list');
        /**@type {HTMLParagraphElement*/
        this[warningParagraphElement] = document.querySelector('.warning');

        this.sliderMenuOnMouseLeave = this.sliderMenuOnMouseLeave.bind(this);
        this.sliderMenuOnMouseOver = this.sliderMenuOnMouseOver.bind(this);

        this.attachEvents();
        this.initialize();
    }
    initialize(){

        this.getGamesFromServer();
    }
    /**
     * Method responsible for attaching events for dashboard page html elements.
     */
    attachEvents(){

        this[logoutInputElement].addEventListener('click', this.logout.bind(this));
        this[createInputElement].addEventListener('click', this.createNewGame.bind(this));
        this[sliderMenuElement].addEventListener('mouseover', this.sliderMenuOnMouseOver);
        this[sliderMenuElement].addEventListener('mouseleave', this.sliderMenuOnMouseLeave);
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
     * @param {Object]  data
     * @param {string}  user
     */
    addItemToGamesList(data, user){

        const li = document.createElement('li');
        li.innerHTML = Templates.getDashboardGameListElement(data, user);

        this[gamesListElement].appendChild(li);
    }
    /**
     * Method responsible for fetching user ongoing and available to join games data from server and attaching each game to appriopiate list.
     */
    getGamesFromServer(){

        const user = this.getUser();

        this.showLoader();

        Ajax.get('/games', {user}, true).then(function(data){

            Ajax.validateAjaxResponseRedirect(data);

            if(data.length) {

                data.forEach(function (element) {

                    this.addItemToGamesList(element, user);
                }.bind(this));
            }else{

                this.showServerMessage('You have no ongoing games.')
            }

            return Ajax.get('/games_to_join', {user}, true);
        }.bind(this)).then(function(data){

            if(data.length){

                data.forEach(function(item){

                    this.addItemToSliderMenu(item);
                }.bind(this));
            }else{

                this.addItemToSliderMenu();
            }

            this.hideLoader();
            this.validateGamesQuantity();
        }.bind(this));
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
     * Method responsible for creating new game.
     */
    createNewGame(){

        const user = this.getUser();
        let newListElement;

        this.showLoader();

        Ajax.post('/create_game', {user}).then(function(data){

            Ajax.validateAjaxResponseRedirect(data);
            this.addItemToGamesList(data, user);
            this.hideLoader();
            this.validateGamesQuantity();

            DomHelper.showGrowler('Game successfully created');
        }.bind(this)).catch(function(error){

            console.log(error);
        });
    }
    /**
     * Method responsible for showing loader during asynchronous data fetching.
     */
    showLoader(){

        const loader = this.getLoaderElement();

        this.addClass(this[mainPageElement], 'disabled');
        this.addClass(this[sliderMenuElement], 'disabled');
        this.showElement(loader);
    }
    /**
     * Method responsible for hiding loader.
     */
    hideLoader(){

        const loader = this.getLoaderElement();

        this.removeClass(this[mainPageElement], 'disabled');
        this.removeClass(this[sliderMenuElement], 'disabled');
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
     * Method responsible for checking quantity of active games and disabling "create game" button in case if there are more than 4 active games.
     */
    validateGamesQuantity(){

        const list = this.getGamesList().childNodes;

        if(list.length > 3){

            this.disableElement(this[createInputElement]);
            this.disableElement(this[sliderMenuElement]);
            this[warningParagraphElement].textContent = 'You have exceeded allowed number of active games. Complete your active games.';
        }
    }
    /**
     * Method responsible for creating new side slider list item.
     * @param {Object}  data    Data containing information about game.
     */
    addItemToSliderMenu(data){

        const li = document.createElement('li');
        let link;

        li.innerHTML = data ? Templates.getDashboardSliderMenuListElement(data) : Templates.getDashboardEmptySliderMenuListElement();
        link = li.querySelector('a');

        if(link) {

            link.addEventListener('click', this.joinGame.bind(this, data));
        }

        this[sliderMenuElement].appendChild(li);
    }
    /**
     * Callback function for slider menu on event "onmouseover".
     */
    sliderMenuOnMouseOver(){

        const firstMenuItem = this[sliderMenuElement].querySelector('.slider-menu-list > li:first-child');
        const sliderMenuItems = this[sliderMenuElement].querySelectorAll('.slider-menu-list > li:not(:first-child)');

        this[sliderMenuElement].classList.add('active');
        firstMenuItem.classList.add('active');
        sliderMenuItems.forEach(function(menuItem){

            menuItem.classList.add('active');
        });
    }
    /**
     * Callback function for slider menu on event "onmouseleave".
     */
    sliderMenuOnMouseLeave(){

        const firstMenuItem = this[sliderMenuElement].querySelector('.slider-menu-list > li:first-child');
        const sliderMenuItems = this[sliderMenuElement].querySelectorAll('.slider-menu-list > li:not(:first-child)');

        this[sliderMenuElement].classList.remove('active');
        this[sliderMenuElement].scrollTop = 0;
        firstMenuItem.classList.remove('active');
        sliderMenuItems.forEach(function(menuItem){

            menuItem.classList.remove('active');
        });
    }
    /**
     * Callback function for link click event handler, inside game to join.
     * @param {Object}      gameDataObject  Object with chosen game to join data.
     * @param {MouseEvent}  ev              Mouse event which triggered this function.
     */
    joinGame(gameDataObject, ev){

        const user = this.getUser();
        const linkParentElement = ev.target.parentElement.parentElement.parentElement;

        ev.preventDefault();
        this.showLoader();

        Ajax.post('/join_game', {data: gameDataObject, user: user}).then(function(data){

            if(data.result){

                Object.defineProperty(gameDataObject, 'black', {value: user});
                this[sliderMenuElement].removeChild(linkParentElement);
                this.addItemToGamesList(gameDataObject, user);
            }

            DomHelper.showGrowler(data.message);
            this.hideLoader();
            this.validateGamesQuantity();
        }.bind(this)).catch(function(error){

            console.log(error);
        });
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