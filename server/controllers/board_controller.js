/**
 * @author Lukasz Lach
 */

const GameBoardModel = require('./../models/gameboard_model');
const Observer = require('./../../core/observer');
const FigureEnums = require('./../../enums/figures');
const calculateMoves = require('./../helper/moves_calculation');

const gameBoardModel = Symbol();

/**
 * @class
 * @typedef {Object}    BoardController
 */
class BoardController extends Observer{
    /**
     * @constructor
     */
    constructor(){

        super();
        /**@type {GameBoardModel}*/
        this[gameBoardModel] = new GameBoardModel();
    }
    /**
     * Returns model of game board.
     * @returns {GameBoardModel}
     */
    getGameBoardModel(){

        return this[gameBoardModel];
    }
    /**
     * Returns array of chosen figure possible moves coordinates.
     * @param {{x: number, y: number}}  coordinates
     * @param {string}                  colour
     * @returns {Array.{x: number, y: number}}
     */
    getFigurePossibleMoves(coordinates, colour){

        const figure = this.getGameBoardModel().getFigure(coordinates);
        const boardState = this.getBoardState();

        if(!figure || figure.getOwner() !== colour){

            return {};
        }

        return calculateMoves(figure, coordinates, boardState);
    }
    getBoardState(){

        return this.getGameBoardModel().getDataToSerialization();
    }
    setCurrentFigurePossibleMoves(possibleMoves){

        this.getGameBoardModel().setCurrentFigurePossibleMoves(possibleMoves);
    }
    resetCurrentFigurePossibleMoves(){

        this.getGameBoardModel().resetCurrentFigurePossibleMoves();
    }
    /**
     * Method responsible for checking whether move choosen by player is legal.
     * @param {{x: number, y: number}}  coordinates
     * @returns {boolean}
     */
    checkIfChosenCoordinatesMeetsPossibleMoves(coordinates){

        const playerPossibleMoves = this.getGameBoardModel().getCurrentFigurePossibleMoves();

        for(let item of playerPossibleMoves){

            if(coordinates.x === item.x && coordinates.y === item.y){

                return true;
            }
        }

        return false;
    }
    moveFigure(sourceCoords, targetCoords){

        const sourceCell = this.getGameBoardModel().getCell(sourceCoords);
        const targetCell = this.getGameBoardModel().getCell(targetCoords);
        const movedFigure = sourceCell.getFigure()

        targetCell.setFigure(movedFigure);
        sourceCell.removeFigure();

        if(movedFigure.getFigureName() === FigureEnums.PAWN && !movedFigure.hasFigureMoved()){

            movedFigure.markFigureAsMoved();
        }
    }

    /**
     * Method which calculates and returns array of coordinates of player figure which are able to move in this turn.
     * @param {string}  player  Player colour.
     * @returns {Array}
     */
    getPlayerFiguresAbleToMove(player){

        let examinedFigure;
        const figuresAbleToMove = [];

        for(let i=0; i<8; i++){

            for(let j=0; j<8; j++){

                examinedFigure = this.getGameBoardModel().getCell({x: i, y: j}).getFigure();

                if(examinedFigure && examinedFigure.getOwner() === player && this.getFigurePossibleMoves({x: i, y: j}, player).length){

                    figuresAbleToMove.push({x: i, y: j});
                }
            }
        }

        return figuresAbleToMove;
    }
}

module.exports = BoardController;