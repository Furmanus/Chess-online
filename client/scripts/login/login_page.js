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
const loaderElement = Symbol();
const mainElement = Symbol();
const growlerContainer = Symbol()

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
        /**@type {HTMLDivElement}*/
        this[loaderElement] = document.querySelector('.loader-container');
        /**@type {HTMLDivElement}*/
        this[mainElement] = document.querySelector('.main');
        /**@type {HTMLDivElement}*/
        this[growlerContainer] = document.querySelector('.growler-container');

        this.bindMethods();
        this.attachEvents();
    }
    /**
     * Method responsible for attaching events to form html elements.
     */
    attachEvents(){

        this[submitElement].addEventListener('click', this.validateFormData);
        this[registerElement].addEventListener('click', this.onRegisterButtonClick);
    }
    /**
     * Method responsible for binding methods defined in class to its instance.
     */
    bindMethods(){

        this.validateFormData = this.validateFormData.bind(this);
        this.validateUserLogin = this.validateUserLogin.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.onRegisterButtonClick = this.onRegisterButtonClick.bind(this);
    }
    /**
     * Method responsible for validating form data.
     */
    validateFormData(){

        const login = this[userLoginElement].value;
        const password = this[userPasswordElement].value;
        const main = this[mainElement];
        const hideLoader = this.hideLoader;
        const loginPageObject = this;

        if(this.hasError){

            this.clearErrors();
        }

        this.disableButtons();

        Ajax.post('/login_form_validate', {login, password}, this.showLoader).then(function(data){

            if(!data.loginSuccessful){

                loginPageObject.showError(data.errorMessage);
            }else{

                window.location = `/dashboard?user=${login}`;
            }

            hideLoader();
            loginPageObject.enableButtons();
        });
    }
    onRegisterButtonClick(){

        const loginValidationResult = this.validateUserLogin();
        const passwordValidationResult = this.validateUserPassword();
        const loginValue = this[userLoginElement].value;
        const passwordValue = this[userPasswordElement].value;
        const loginPageObject = this;

        if(this.hasError){

            this.clearErrors();
        }

        if(loginValidationResult.result && passwordValidationResult){

            this.disableButtons();

            Ajax.post('/register', {user: loginValue, password: passwordValue}).then(function(data){

                if(data.result){

                    DomHelper.showGrowler(data.message);
                    window.setTimeout(function(){

                        window.location = `/dashboard?user=${loginValue}`;
                    }, 1000);
                }else{

                    DomHelper.showGrowler(data.message);
                }

                loginPageObject.enableButtons();
            }).catch(function(error){

                console.log(error);
            });
        }else{

            if(!loginValidationResult.result){

                this.showError(loginValidationResult.error);
            }
            if(!passwordValidationResult){

                this.showError('Password has to contain 3-10 characters. It has to start with letter, only letters, numbers and ' +
                    'underscores are allowed');
            }
        }
    }
    /**
     * Method responsible for validating user login for register action.
     * @returns {{result: boolean, error: string}}  Returns object containing information about validation result and error message, in case where validation
     * was not successful.
     */
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
     * Method responsible for validating user password. User password need to have at least 3 and max 9 chars, at least one digit, at least one small letter
     * and at least one capital letter.
     * @returns {boolean}
     */
    validateUserPassword(){

        const password = this[userPasswordElement].value;

        return /^[a-zA-Z]\w{3,10}$/.test(password);
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
    /**
     * Method responsible for showing error text (in growler) to user).
     * @param {string}  errorText   Error message to show
     */
    showError(errorText){

        this.hasError = true;
        DomHelper.showGrowler(errorText);
    }
    /**
     * Removes all growler messages from page;
     */
    clearErrors(){

        DomHelper.removeGrowlers();
        this.hasError = false;
    }
}

export default LoginPage;