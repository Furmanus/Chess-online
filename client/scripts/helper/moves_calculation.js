/**
 * @author Lukasz Lach
 */

const FigureEnums = require('../../../enums/figures');
const ColourEnums = require('../../../enums/colours');

/**
 * Method responsible for returning array containing objects with coordinates of certain figure possible moves.
 * @param {Figure}                  figure
 * @param {{x: number, y: number}}  startingPoint
 * @param {Object}                  boardState
 * @returns {Object}
 */
module.exports = function(figure, startingPoint, boardState){

    const owner = figure.getColour();
    const name = figure.getFigureName();
    const moves = figure.getPossibleMoves().moves;
    const resultPossibleMoves = [];
    let currentPoint = null;
    let pawnMoves;

    if(figure.getPossibleMoves().continous){
        //calculating moves for rook, bishop and queen
        for(let direction of moves){
            /**
             * For every direction point in figure moves object, we set current point, which is next point in chosen direction from figure starting point. Next we start
             * recursive function which triggers itself on each next point in chosen direction, unless blocked by other figure or edge of game board.
             */
            currentPoint = {x: startingPoint.x + direction.x, y: startingPoint.y + direction.y};
            calculateMovesInDirection(direction);
        }
    }else{
        //calculating moves for pawn
        if(figure.getPossibleMoves().directional){
            //we check if examined pawn moves north or south, and we take only object where pawn moves by one field. We use it later to calculate diagonal captures.
            const verticalDirection = moves[moves.length - 1];
            //we reverse array, so moves are examined in ascending (by distance) order. We copy array so original array won't be modified (in case of repeated click on same figure)
            pawnMoves = moves.slice().reverse();

            for(let move of pawnMoves){

                currentPoint = {x: startingPoint.x + move.x, y: startingPoint.y + move.y};

                if(currentPoint.x < 0 || currentPoint.x > 7 || currentPoint.y < 0 || currentPoint.y > 7){

                    continue;
                }
                if(!boardState[`${currentPoint.x}x${currentPoint.y}`].figure) {

                    resultPossibleMoves.push({x: startingPoint.x + move.x, y: startingPoint.y + move.y});
                }
                //we check if pawn can capture any figure, in diagonal direction
                if(currentPoint.x - 1 >= 0){

                    let examinedDiagonalLeftPoint = boardState[`${currentPoint.x - 1}x${startingPoint.y + verticalDirection.y}`];

                    if(examinedDiagonalLeftPoint.figure && examinedDiagonalLeftPoint.colour !== owner){

                        resultPossibleMoves.push({x: currentPoint.x - 1, y: startingPoint.y + verticalDirection.y});
                    }
                }
                if(currentPoint.x + 1 <= 7){

                    let examinedDiagonalRightPoint = boardState[`${currentPoint.x + 1}x${startingPoint.y + verticalDirection.y}`];

                    if(examinedDiagonalRightPoint.figure && examinedDiagonalRightPoint.colour !== owner){

                        resultPossibleMoves.push({x: currentPoint.x + 1, y: startingPoint.y + verticalDirection.y});
                    }
                }
                //case where path in front of pawn is blocked by a figure, we prevent further calculation of possible movement
                if(Math.abs(move.y) === 1 && boardState[`${currentPoint.x}x${currentPoint.y}`].figure){

                    break;
                }
            }
        }else{
            //calculating moves for king and knight
            for(let move of moves){

                currentPoint = {x: startingPoint.x + move.x, y: startingPoint.y + move.y};

                if(currentPoint.x < 0 || currentPoint.x > 7 || currentPoint.y < 0 || currentPoint.y > 7){

                    continue;
                }

                if(boardState[`${currentPoint.x}x${currentPoint.y}`].figure && boardState[`${currentPoint.x}x${currentPoint.y}`].colour === owner){

                    continue;
                }

                resultPossibleMoves.push({x: startingPoint.x + move.x, y: startingPoint.y + move.y});
            }
        }
    }

    return resultPossibleMoves;

    function calculateMovesInDirection(direction){

        if(currentPoint.x < 0 || currentPoint.x > 7){

            return;
        }
        if(currentPoint.y < 0 || currentPoint.y > 7){

            return;
        }
        if(boardState[`${currentPoint.x}x${currentPoint.y}`].figure){

            if(boardState[`${currentPoint.x}x${currentPoint.y}`].colour === owner){

                return;
            }else{

                resultPossibleMoves.push({x: currentPoint.x, y: currentPoint.y});
                return;
            }
        }

        resultPossibleMoves.push({x: currentPoint.x, y: currentPoint.y});
        currentPoint.x += direction.x;
        currentPoint.y += direction.y;

        calculateMovesInDirection(direction);
    }
}