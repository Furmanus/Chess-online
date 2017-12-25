/**
 * @author Lukasz Lach
 */

const FigureEnums = require('./../../enums/figures');
const ColourEnums = require('./../../enums/colours');

module.exports = {

    createInitialGameData: function(){

        let figureColour = null;
        let boardData = {};


        for(let i=0; i<8; i++){

            for(let j=0; j<8; j++){

                if(j === 1 || j === 6){

                    boardData[`${i}x${j}`] = {

                        colour: (j === 1) ? ColourEnums.BLACK : ColourEnums.WHITE,
                        figure: FigureEnums.PAWN
                    };
                }else if(j === 0 || j === 7){

                    figureColour = j === 0 ? ColourEnums.BLACK : ColourEnums.WHITE;

                    if(i === 0 || i === 7) {

                        boardData[`${i}x${j}`] = {
                            colour: figureColour,
                            figure: FigureEnums.ROOK
                        };
                    }else if(i === 1 || i === 6){

                        boardData[`${i}x${j}`] = {
                            colour: figureColour,
                            figure: FigureEnums.KNIGHT
                        };
                    }else if(i === 2 || i === 5){

                        boardData[`${i}x${j}`] = {
                            colour: figureColour,
                            figure: FigureEnums.BISHOP
                        };
                    }else if(i === 3){

                        boardData[`${i}x${j}`] = {
                            colour: figureColour,
                            figure: FigureEnums.QUEEN
                        };
                    }else if(i === 4){

                        boardData[`${i}x${j}`] = {
                            colour: figureColour,
                            figure: FigureEnums.KING
                        };
                    }
                } else {

                    boardData[`${i}x${j}`] = {
                        colour: null,
                        figure: null
                    };
                }
            }
        }

        return boardData;
    }
}