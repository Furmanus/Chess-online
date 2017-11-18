/**
 * @author Lukasz Lach
 */

const FigureEnums = require('./../../../enums/figures');

const moves = {

    pawn: {

        continous: false,
        directional: true,
        hasMoved: false,
        moves: null
    },
    rook: {

        continous: true,
        directional: false,
        hasMoved: false,
        moves: [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}]
    },
    knight: {

        continous: false,
        directional: false,
        hasMoved: false,
        moves: [{x: 2, y: -1}, {x: 2, y: 1}, {x: -2, y: 1}, {x: -2, y: -1}, {x: -1, y: 2}, {x: 1, y: 2}, {x: -1, y: -2}, {x: 1, y: -2}]
    },
    bishop: {

        continous: true,
        directional: false,
        hasMoved: false,
        moves: [{x: 1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}]
    },
    queen: {

        continous: true,
        directional: false,
        hasMoved: false,
        moves: [{x: 1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}]
    },
    king: {

        continous: false,
        directional: false,
        hasMoved: false,
        moves: [{x: 1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}]
    }
}

module.exports = moves;