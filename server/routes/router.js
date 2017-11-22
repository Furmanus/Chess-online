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
        this.possibleFigureMovesRequest = this.possibleFigureMovesRequest.bind(this);

        this.initializePaths();
        return router;
    }

    initializePaths(){

        router.get('/board_state', this.getBoardState);
        router.get('/figure_moves', this.possibleFigureMovesRequest);
    }
    /**
     * Callback function for '/board_state' GET route. Takes board states from main controller and sends it in response.
     * @param {Object} req
     * @param {Object} res
     */
    getBoardState(req, res){

        res.json(this.getMainController().getBoardState());
    }
    possibleFigureMovesRequest(req, res){

        let chosenFigurePossibleMoves = undefined;
        const coordinates = {x: parseInt(req.query.x), y: parseInt(req.query.y)};
        const highlightedCell = this.getMainController().getCurrentlyHighlightedCell();

        if(!highlightedCell){

            chosenFigurePossibleMoves = this.getMainController().getFigureMoves(coordinates);
            this.getMainController().setCurrentlyHighlightedCell(coordinates.x, coordinates.y);
            res.send(JSON.stringify({action: 'highlight', data: chosenFigurePossibleMoves}));
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