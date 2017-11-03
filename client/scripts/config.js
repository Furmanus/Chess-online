/**@author Lukasz Lach*/

/**
 * @type {null|string}
 */
const player = null;

class Config{

    /**
     * Returns color of player.
     * @returns {null|string}
     */
    static getPlayer(){

        return player;
    }

    /**
     * Sets color of player.
     * @param {string}  player  Color of player.
     */
    static setPlayer(player){

        player = player;
    }
}

export default Config;