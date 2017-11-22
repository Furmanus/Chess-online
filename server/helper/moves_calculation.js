/**
 * @author Lukasz Lach
 */

const FigureEnums = require('./../../enums/figures');
const ColourEnums = require('./../../enums/colours');

/**
 * Method responsible for returning array which contains object with coordinates of possible moves.
 * @param {Figure}                  figure
 * @param {{x: number, y: number}}  startingPoint
 * @param {Object}                  boardState
 * @returns {Object}
 */
module.exports = function(figure, startingPoint, boardState){

    const owner = figure.getOwner();
    const name = figure.getFigureName();
    const moves = figure.getPossibleMoves().moves;
    const resultPossibleMoves = [];
    let currentPoint = null

    if(figure.getPossibleMoves().continous){

        for(let direction of moves){

            currentPoint = {x: startingPoint.x + direction.x, y: startingPoint.y + direction.y};
            calculateMovesInDirection(direction);
        }
    }else{

        if(figure.getPossibleMoves().directional){
            //TODO dorobić bicie po ukosie
            for(let move of moves){
                currentPoint = {x: startingPoint.x + move.x, y: startingPoint.y + move.y};

                if(currentPoint.x < 0 || currentPoint.x > 7 || currentPoint.y < 0 || currentPoint.y > 7){

                    continue;
                }

                if(!boardState[`${currentPoint.x}x${currentPoint.y}`].figure) {

                    resultPossibleMoves.push({x: startingPoint.x + move.x, y: startingPoint.y + move.y});
                }
            }
        }else{

            for(let move of moves){

                currentPoint = {x: startingPoint.x + move.x, y: startingPoint.y + move.y};

                if(currentPoint.x < 0 || currentPoint.x > 7 || currentPoint.y < 0 || currentPoint.y > 7){

                    continue;
                }

                if(boardState[`${currentPoint.x}x${currentPoint.y}`].figure && boardState[`${currentPoint.x}x${currentPoint.y}`].owner === owner){

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

            if(boardState[`${currentPoint.x}x${currentPoint.y}`].owner === owner){

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