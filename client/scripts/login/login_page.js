import Ajax from './../helper/ajax';
import EventEnums from './../../../enums/events';
import DomHelper from './../helper/dom';
import Page from './page';

/**
 * @author Lukasz Lach
 */

//private variables declaration
const userLoginElement = Symbol();
const userPasswordElement = Symbol();
const formElement = Symbol();
const submitElement = Symbol();
const registerElement = Symbol();
const errorElement = Symbol();
const loaderElement = Symbol();
const mainElement = Symbol();

class LoginPage extends Page{

    constructor(){

        super();

        /**@type {HTMLInputElement}*/
        this[userLoginElement] = document.querySelector('input[type=text');
        /**@type {HTMLInputElement}*/
        this[userPasswordElement] = document.querySelector('input[type=password');
        /**@type {HTMLFormElement}*/
        this[formElement] = document.querySelector('form');
        /**@type {HTMLInputElement}*/
        this[submitElement] = document.getElementById('submit');
        /**@type {HTMLInputElement}*/
        this[registerElement] = document.getElementById('register');
        /**@type {HTMLParagraphElement}*/
        this[errorElement] = document.getElementById('error');
        /**@type {HTMLDivElement}*/
        this[loaderElement] = document.querySelector('.loader-container');
        /**@type {HTMLDivElement}*/
        this[mainElement] = document.querySelector('.main');

        this.bindMethods();
        this.attachEvents();
    }
    /**
     * Method responsible for attaching events to form html elements.
     */
    attachEvents(){

        this[submitElement].addEventListener('click', this.validateFormData);
    }
    /**
     * Method responsible for binding methods defined in class to its instance.
     */
    bindMethods(){

        this.validateFormData = this.validateFormData.bind(this);
        this.validateUserLogin = this.validateUserLogin.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
    }
    /**
     * Method responsible for validating form data.
     */
    validateFormData(){

        const login = this[userLoginElement].value;
        const password = this[userPasswordElement].value;
        const error = this[errorElement];
        const main = this[mainElement];
        const hideLoader = this.hideLoader;

        Ajax.post('/login_form_validate', {login, password}, this.showLoader).then(function(data){

            if(!data.loginSuccessful){

                error.textContent = data.errorMessage;
            }else{

                window.location = `/dashboard?user=${login}`;
            }

            hideLoader();
        });
    }

    validateUserLogin(){
        //TODO poprawic regexpy i walidację
        const login = this[userLoginElement].value;

        const loginLengthTest = login.length > 3 && login.length < 12;
        const startsWithLetterTest = /[a-zA-Z]/.test(login.charAt(0));
        let onlyWordCharactersTest = true;

        for(let char of login){

            if(!/\w/.test(char)){
                onlyWordCharactersTest = false;
            }
        }

        if(!onlyWordCharactersTest){

            return {result: false, error: 'Your user name can contain only capital letters, lowercase letters, numbers and underscore sign.'};
        }else if(!loginLengthTest){

            return {result: false, error: 'User name should be at least 4 characters and max 12 characters long.'};
        }else if(!startsWithLetterTest){

            return {result: false, error: 'User name should start with letter.'};
        }else{

            return {result: true};
        }
    }
    /**
     * Method responsible for showing loader on page.
     */
    showLoader(){

        const loader = this[loaderElement];
        const form = this[formElement];

        this.showElement(loader);
        this.addClass(form, 'transparent');
        this.disableForm();
    }
    /**
     * Method responsible for hiding loader on page.
     */
    hideLoader(){

        const loader = this[loaderElement];
        const form = this[formElement];

        this.hideElement(loader);
        this.removeClass(form, 'transparent');
        this.enableForm();
    }
    /**
     * Method responsible for disabling form inputs.
     */
    disableForm(){

        const form = this[formElement];
        const formElements = form.getElementsByTagName('input');

        for(let element of formElements){

            element.setAttribute('disabled', 'disabled');
        }
    }
    /**
     * Method responsible for enabling form inputs.
     */
    enableForm(){

        const form = this[formElement];
        const formElements = form.getElementsByTagName('input');

        for(let element of formElements){

            element.removeAttribute('disabled');
        }
    }
}

export default LoginPage;