import MainController from "./controller/controller";

(function(){

    const location = window.location.href;
    const initialQueryData = location.slice(location.indexOf('?') + 1).split('&');
    const gameInitialData = {};
    let examinedElement;

    initialQueryData.forEach(function(item){

        examinedElement = item.split('=');
        gameInitialData[examinedElement[0]] = examinedElement[1];
    });

    new MainController(gameInitialData)
})();