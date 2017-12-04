/**
 * @author Lukasz Lach
 */

/**@typedef EventEnums*/
let EventEnums = {

    //CLIENT EVENTS
    BOARD_CLICK: 'board:click',
    SOCKET_CONNECTION_ESTABLISHED: 'socket:connection_ready',
    CLIENT_NOTIFY_MOVE_READY: 'client_notify_move_ready',
    BOTH_PLAYERS_READY: 'both:players:ready',
    //SERVER EVENTS
    SEND_SERVER_GAME_STATUS_READY: 'server:players_ready',
    CLIENT_DISCONNECTED: 'client:disconnected',
    //SERVER TO CLIENT EVENTS
    BOTH_PLAYERS_READY: 'server_client:ready',
    PLAYER_MOVED: 'player:moved'
};

module.exports = EventEnums;