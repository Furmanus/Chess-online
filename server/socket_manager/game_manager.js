/**
 * @author Lukasz Lach
 */

const gamesData = {};

class GameManager{

    /**
     * Method responsible for removing user from temporary game and player data.
     * @param {string}  socketId    Unique socket id of client who left page.
     * @returns {Object}
     */
    static removeUserFromGame(socketId){

        const disconnectedUserData = {};

        for(let game in gamesData){

            for(let users in gamesData[game]){

                if(users === socketId){

                    Object.assign(disconnectedUserData, gamesData[game][users]);
                    delete gamesData[game][users];
                }else {

                    //we need to get socket Id of opposite player who is supposed to receive message
                    Object.assign(disconnectedUserData, {socketId: users});
                }
            }

            if(!Object.keys(gamesData[game]).length){

                delete gamesData[game];
            }
        }

        return disconnectedUserData
    }
    /**
     * Method responsible registering temporary game and player data. Whenever player logs into game, game data is logged into games map. Each map key is equal to game id, and value
     * is object, which keys are equal to user names and values are equal to those users sockets Id.
     * @param {string}  gameId
     * @param {Object}  playerData
     * @param {string}  playerData.user
     * @param {string}  playerData.socketId
     * @param {string}  playerData.colour
     */
    static addUserToGame(gameId, playerData){

        if(!gamesData[gameId]){

            gamesData[gameId] = {};
        }

        Object.assign(gamesData[gameId], {

            [playerData.socketId]: {

                user: playerData.user,
                colour: playerData.colour
            }
        });
    }
    /**
     * Method responsible for getting users currently logged in certain game.
     * @param {string}  gameId
     * @returns {Object}    Returns object containing information about players logged in game (key - socket id, value - user name)
     */
    static getUsersLoggedInGame(gameId){

        return gamesData[gameId];
    }
}

module.exports = GameManager;