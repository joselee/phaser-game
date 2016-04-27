namespace PhaserGame {
    export class SocketService {
        socket: SocketIOClient.Socket;
        static $inject = ['$rootScope'];
        constructor(private $rootScope: ng.IRootScopeService){
            this.socket = io();
            
            this.socket.on('chatMessageToClients', (message: IChatMessage) => {
                this.$rootScope.$emit('addMessageToChatbox', message);
            });
        }

        chatMessageToServer(message: IChatMessage){
            this.socket.emit('chatMessageToServer', message);
        }
    }

    app.service('socketService', SocketService);
}