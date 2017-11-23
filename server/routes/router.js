/**
 * @author Lukasz Lach
 */

const express = require('express');

/**
 * @typedef {Object} router
 */
let router = null;

const mainController = Symbol();

/**
 * Poorly implemented, absolutely unnecessary singleton design pattern.
 * @class
 */
class Router{
    /**
     * Constructor for router singleton class.
     * @param mainControllerObject
     * @return {router}
     */
    constructor(mainControllerObject){

        if(!router){

            router = express.Router();
        }

        if(mainControllerObject && !this[mainController]) {

            this[mainController] = mainControllerObject;
        }

        this.getBoardState = this.getBoardState.bind(this);
        this.boardClickRequestHandler = this.boardClickRequestHandler.bind(this);

        this.initializePaths();
        return router;
    }

    initializePaths(){

        router.get('/board_state', this.getBoardState);
        router.post('/figure_moves', this.boardClickRequestHandler);
    }
    /**
     * Callback function for '/board_state' GET route. Takes board states from main controller and sends it in response.
     * @param {Object} req
     * @param {Object} res
     */
    getBoardState(req, res){

        res.json(this.getMainController().getBoardState());
    }

    /**
     * Callback function for '/figure_moves' POST request. Checks whether any figure is currently selected by player, and if yes, send to client array of possible moves.
     * @param {Object} req
     * @param {Object} res
     */
    boardClickRequestHandler(req, res){

        let chosenFigurePossibleMoves = undefined;
        const coordinates = {x: parseInt(req.body.x), y: parseInt(req.body.y)};
        const highlightedCell = this.getMainController().getCurrentlyHighlightedCell();

        if(!highlightedCell){

            chosenFigurePossibleMoves = this.getMainController().getFigureMoves(coordinates);
            if(Object.keys(chosenFigurePossibleMoves).length === 0){

                res.send(JSON.stringify({action: 'no action'}));
            }else {

                this.getMainController().setCurrentlyHighlightedCell(coordinates.x, coordinates.y);
                res.send(JSON.stringify({action: 'highlight', data: chosenFigurePossibleMoves}));
            }
            return;
        }
        if(highlightedCell && coordinates.x === highlightedCell.x && coordinates.y === highlightedCell.y){

            this.getMainController().resetCurrentlyHighlightedCell();
            res.send(JSON.stringify({action: 'reset'}));
            return;
        }
        if(highlightedCell && !(coordinates.x === highlightedCell.x && coordinates.y === highlightedCell.y)){

            res.send(JSON.stringify({action: 'no action'}));
        }
    }
    /**
     * Returns main controller of server side.
     * @return {MainController}
     */
    getMainController(){

        return this[mainController];
    }
}

module.exports = Router;