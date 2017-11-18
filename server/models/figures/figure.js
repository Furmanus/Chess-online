/**
 * @author Lukasz Lach
 */

const FigureEnums = require('./../../../enums/figures');
const ColourEnums = require('./../../../enums/colours');
const DirectionEnums = require('./../../../enums/directions');
const figuresPossibleMoves = require('./figure_moves');

const owner = Symbol();
const possibleMoves = Symbol();
const figureName = Symbol();

/**
 * Class representing pawn figure data model.
 * @class
 * @typedef {Object} Figure
 */
class Figure{
    /**
     * Constructor for figure data model class.
     * @param playerOwner   String name of player colour who owns figure. Member of ColourEnums.
     * @param figureType    String name of type of this figure. Member of FigureEnums.
     */
    constructor(playerOwner, figureType){

        /**
         * @type {string}
         * @memberOf {ColourEnums}
         * @private
         */
        this[owner] = playerOwner;
        /**
         * @private
         * @type {Object}
         */
        this[possibleMoves] = {};
        /**
         * @private
         * @memberOf {FigureEnums}
         * @type {string}
         */
        this[figureName] = figureType;

        this.initializePossibleMoves();
    }
    /**
     * Method which initializes data in figure initialPossibleMoves object.
     */
    initializePossibleMoves(){

        const possibleMoves = this.getPossibleMoves();
        const figureName = this.getFigureName();
        //needed to calculate pawn possible moves
        const moveDirection = (this.getOwner() === ColourEnums.WHITE) ? DirectionEnums.NORTH : DirectionEnums.SOUTH;
        const movesTableByDirection = (moveDirection === DirectionEnums.NORTH) ? [{x: 0, y: -2}] : [{x: 0, y: 2}];
        /**
         * Last condition in below ternary operator creates copy of array defined in figure_moves.js file.
         * That array contains REFERENCES to objects containing x and y move values. It is important to remember that, in case of dynamic modification of specific figure object
         * moves. Right now it doesn't matter, because except for pawn, all figures have fixed set of moves.
         */
        const figureMoves = (figureName === FigureEnums.PAWN) ? movesTableByDirection : figuresPossibleMoves[figureName].moves.slice();

        possibleMoves.continous = figuresPossibleMoves[figureName].continous;
        possibleMoves.directional = figuresPossibleMoves[figureName].directional;
        possibleMoves.hasMoved = figuresPossibleMoves[figureName].hasMoved;
        possibleMoves.moves = figureMoves;
    }
    /**
     * Method responsible for marking figure as moved (after initial movement) and reducing its moving distance to 1 cell.
     */
    markPawnAsMoved(){

        const moveValueToSubstract = (this.getOwner() === ColourEnums.WHITE) ? -1 : 1;

        this.getPossibleMoves().hasMoved = true;
        this.getPossibleMoves().moves[0].y - moveValueToSubstract;
    }
    /**
     * Returns possible moves object of a figure.
     * @return {Object}
     */
    getPossibleMoves(){

        return this[possibleMoves];
    }
    /**
     * Returns owner of figure.
     * @return {string}
     */
    getOwner(){

        return this[owner];
    }
    /**
     * Returns name of this figure.
     * @return {string}
     */
    getFigureName(){

        return this[figureName];
    }
}

module.exports = Figure;