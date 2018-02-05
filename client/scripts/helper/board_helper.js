/**
 * @author Lukasz Lach
 */

import deepcopy from 'deepcopy';

export default class BoardHelper{

    /**
     * Method responsible for retrieving from current board state (after movement) and given movement coordinates
     * @param {Object}  moveData
     * @returns {Object}
     */
    static getPreviousBoardState(moveData){

        const {
            sourceX,
            sourceY,
            targetX,
            targetY,
        } = moveData;
        const boardState = deepcopy(moveData.boardState);
        const sourceStringCoordinate = `${sourceX}x${sourceY}`;
        const targetStringCoordinate = `${targetX}x${targetY}`;

        boardState[sourceStringCoordinate].colour = boardState[targetStringCoordinate].colour;
        boardState[sourceStringCoordinate].figure = boardState[targetStringCoordinate].figure;
        boardState[sourceStringCoordinate].hasMoved = boardState[targetStringCoordinate].hasMoved;

        if(moveData.capturedFigure){

            boardState[targetStringCoordinate].colour = moveData.capturedFigureColor;
            boardState[targetStringCoordinate].figure = moveData.capturedFigure;
        }else {

            boardState[targetStringCoordinate].colour = null;
            boardState[targetStringCoordinate].figure = null;
            boardState[targetStringCoordinate].hasMoved = null;
        }

        return {

            boardState,
            sourceX,
            sourceY,
            targetX,
            targetY
        };
    }
}