/**
 * @author Lukasz Lach
 */

/**
 * Method which converts object into url like query (example: {a: 1, b: 2} -> 'a=1&b=2'). Works only with object with values of primitive types.
 * @param   {Object}    object  Object to convert.
 * @returns {string}    String containing converted data.
 */
function buildQueryString(object){

    const keys = Object.keys(object);
    let query = [];

    for(let key of keys){

        query.push(`${key}=${object[key]}`);
    }

    return query.join('&');
}

/**
 * Helper class containing static methods for sending AJAX requests.
 * @class
 */
class Ajax{
    /**
     * Method responsible for sending AJAX POST request at certain url.
     * @param   {string}    url             URL adress where data should be send.
     * @param   {Object}    data            Data object to send.
     * @param   {function}  onProgress      Callback on progress function.
     * @param   {boolean}   isJsonRequest   Parameter determining whether requests content-type should be 'application/json'. If set to false, it will
     *                                      be 'application/x-www-form-urlencoded'. By default set to true.
     */
    static post(url, data,  onProgress, isJsonRequest = true){

        return new Promise(function(resolve, reject){

            const ajax = new XMLHttpRequest();
            const contentType = (isJsonRequest === true) ? 'application/json' : 'application/x-www-form-urlencoded';

            Object.assign(data, {isAjaxRequest: true});

            ajax.open('POST', url, true);
            ajax.setRequestHeader('Content-type', contentType);

            ajax.onprogress = onProgress;
            ajax.onload = function(){

                resolve(JSON.parse(ajax.response));
            }
            ajax.onerror = function(){

                reject(ajax.statusText);
            }

            data = (isJsonRequest === true) ? JSON.stringify(data) : buildQueryString(data);

            ajax.send(data);
        });
    }
    /**
     * Method responsible for sending AJAX GET request at certain url.
     * @param   {string}    url             URL adress where data should be send.
     * @param   {Object}    data            Data object to send.
     * @param   {boolean}   jsonResponse    Boolean value indicating whether response should be parsed to JSON
     * @param   {function}  onProgress      Callback on progress function.
     */
    static get(url, data, jsonResponse, onProgress){

        return new Promise(function(resolve, reject){

            const ajax = new XMLHttpRequest();
            const path = `${url}?${buildQueryString(Object.assign(data, {isAjaxRequest: true}))}`;
            let response;

            ajax.open('GET', path, true);

            ajax.onprogress = onProgress;
            ajax.onload = function(){

                response = jsonResponse ? JSON.parse(ajax.response) : ajax.response;
                resolve(response);
            };
            ajax.onerror = function(){

                reject(ajax.statusText);
            }

            ajax.send();
        });
    }
    /**
     * Method responsible for validating whether client should be redirected to another page.
     * @param {Object}  responseData    Response object.
     */
    static validateAjaxResponseRedirect(responseData){

        if(responseData.forcedRedirectUrl){

            window.location = responseData.forcedRedirectUrl.toString();
        }
    }
}

export default Ajax;