/**
 * @author Lukasz Lach
 */

/**@typedef EventEnums*/
let EventEnums = {

    //CLIENT EVENTS
    BOARD_CLICK: 'board:click',
    SOCKET_CONNECTION_ESTABLISHED: 'socket:connection_ready',
    CLIENT_NOTIFY_MOVE_READY: 'client_notify_move_ready',
    MOVE_READY_TO_SEND_SERVER: 'client:move:ready',
    CLIENT_MODEL_MOVE_MADE: 'client:model_move_made',
    //SERVER EVENTS
    SEND_SERVER_GAME_STATUS_READY: 'server:players_ready',
    CLIENT_DISCONNECTED: 'client:disconnected',
    //SERVER TO CLIENT EVENTS ROUTES
    BOTH_PLAYERS_READY: 'server_client:ready',
    PLAYER_MOVED: 'player:moved',
    LOGIN_DATA_VALIDATION: 'login:validate',
    //CLIENT TO SERVER EVENTS
    SEND_PLAYER_MOVE: 'player:move:send'
};

module.exports = EventEnums;