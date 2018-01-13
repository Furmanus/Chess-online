/**
 * @author Lukasz Lach
 */

import Observer from './../../../../core/observer';
import CellModel from './cell_model';
import Figure from './figure_model';
import calculateMoves from './../../helper/moves_calculation';

const cells = Symbol();
const currentlyHighlightedCell = Symbol();
const selectedFigurePossibleMoves = Symbol();

/**
 * @class
 * @typedef {Object}    BoardModel
 */
class BoardModel extends Observer{

    constructor(){

        super();
        /**@type {Map}*/
        this[cells] = new Map();
        /**@type {CellModel|null}*/
        this[currentlyHighlightedCell] = null;
        /**@type {{x: {number}, y: {number}}.Array}*/
        this[selectedFigurePossibleMoves] = null;
    }
    /**
     * Method responsible for building map collection from serialized board data.
     * @param {Object}  boardData   Object containing serialized game board data.
     */
    build(boardData){

        let examinedCoordinateData;

        for(let i=0; i<8; i++){

            for(let j=0; j<8; j++){

                examinedCoordinateData = boardData[`${i}x${j}`];

                if(examinedCoordinateData.figure) {

                    this.setCell(i, j, new Figure(

                        examinedCoordinateData.colour,
                        examinedCoordinateData.figure,
                        examinedCoordinateData.hasMoved)
                    );
                }else{

                    this.setCell(i, j, null);
                }
            }
        }
    }
    /**
     * Method responsible for moving figure from source cell to target cell on game board.
     * @param {number}  sourceX
     * @param {number}  sourceY
     * @param {number}  targetX
     * @param {number}  targetY
     */
    moveFigure(sourceX, sourceY, targetX, targetY){

        const movedFigure = this.getCell(sourceX, sourceY).getFigure();
        const targetFigure = this.getCell(targetX, targetY).getFigure();
        const dataToNotify = {};

        this.getCell(sourceX, sourceY).removeFigure();
        this.getCell(targetX, targetY).setFigure(movedFigure);

        return {

            figure: movedFigure.getFigureName(),
            colour: movedFigure.getColour(),
            capturedFigure: targetFigure && targetFigure.getFigureName()
        };
    }
    /**
     * For given coordinates, build cell model in cells map collection.
     * @param {number}      x   Row (horizontal) coordinate.
     * @param {number}      y   Column (vertical) coordinate.
     * @param {Figure|null} figure  Figure object which is stored in cell (or null if no figure is present)
     */
    setCell(x, y, figure){

        this.getCells().set(`${x}x${y}`, new CellModel(x, y, figure));
    }
    /**
     * Returns cell model from certain coordinates.
     * @param {number}  x   Row (horizontal) coordinate.
     * @param {number}  y   Column (vertical) coordinate.
     * @returns {CellModel}
     */
    getCell(x, y){

        return this.getCells().get(`${x}x${y}`);
    }
    /**
     * Returns cells map collection.
     * @returns {Map}
     */
    getCells(){

        return this[cells];
    }
    /**
     * Returns figure which is stored in certain cell (or null if no figure is present) and its owner (or null if no figure is present).
     * @param {number}  x   Row (horizontal) coordinate.
     * @param {number}  y   Column (vertical) coordinate.
     * @return {{figure: (string|null), owner: (string|null)}}
     */
    getCellData(x, y){

        const figureObject = this.getCells().get(`${x}x${y}`).getFigure();

        if(!figureObject){

            return {

                figure: null,
                colour: null
            }
        }

        return {

            figure: figureObject.getFigureName(),
            colour: figureObject.getColour(),
            hasMoved: figureObject.hasFigureMoved()
        }
    }
    /**
     * Returns array of chosen figure possible moves coordinates.
     * @param {number}  x
     * @param {number}  y
     * @returns {Array.{x: number, y: number}}
     */
    getFigurePossibleMoves(x, y){

        const figure = this.getCell(x, y).getFigure();
        const boardState = this.getDataToSerialization();

        if(!figure){

            return {};
        }

        return calculateMoves(figure, {x: x, y: y}, boardState);
    }
    /**
     * Method responsible for serializing (for Ajax requests purpose) game board data model.
     * @returns {Object}
     */
    getDataToSerialization(){

        const serializedBoardData = {};
        const cellsMapKeys = this.getCells().keys();

        for(let key of cellsMapKeys){

            serializedBoardData[key] = this.getCellData(key[0], key[2]);
        }

        return serializedBoardData;
    }
    /**
     * Method responsible for marking figure at certain coordinates as moved (it means it made its initial move).
     * @param {number}  x   Horizontal (row) coordinate
     * @param {number}  y   Vertical (column) coordinate
     */
    markFigureAsMoved(x, y){

        this.getCell(x, y).getFigure().markFigureAsMoved();
    }
    /**
     * Sets currently highlighted cell variable.
     * @param {CellModel|null}  cellModel
     */
    setCurrentlyHighlightedCell(cellModel){

        this[currentlyHighlightedCell] = cellModel;
    }
    /**
     * Returns currently highlighted cell.
     * @returns {CellModel|null}
     */
    getCurrentlyHighlightedCell(){

        return this[currentlyHighlightedCell];
    }
    /**
     * Sets selected figure possible moves variable. Variable is array containing objects with figure possible moves coordinates.
     * @param {{{x: {number}, y: {number}}.Array}    possibleMoves
     */
    setSelectedFigurePossibleMoves(possibleMoves){

        this[selectedFigurePossibleMoves] = possibleMoves;
    }
    /**
     * Returns array of currently selected figure possible moves.
     * @returns {{{x: {number}, y: {number}}.Array}
     */
    getSelectedFigurePossibleMoves(){

        return this[selectedFigurePossibleMoves];
    }
    /**
     * Resets selected figure possible moves variable (assigns null value).
     */
    resetSelectedFigurePossibleMoves(){

        this[selectedFigurePossibleMoves] = null;
    }
}

export default BoardModel;