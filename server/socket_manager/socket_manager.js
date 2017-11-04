/**
 * @author Lukasz Lach
 */

const socketIo = Symbol();

class SocketManager{

    constructor(server, socket){

        this[socketIo] = socket(server);

        this.initialize();
    }

    initialize(){

        this.getSocketIo().on('connection', function(socket){

            console.log('user connected');
        });
    }

    getSocketIo(){

        return this[socketIo];
    }
}

module.exports = SocketManager;