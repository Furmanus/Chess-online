import MainController from "./controller/controller";

(function(){

    io = io();

    window.front = {

        controller: new MainController()
    }
})();