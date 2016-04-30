namespace PhaserGame {
    export class SocketService {
        socket: SocketIOClient.Socket;
        static $inject = ['$rootScope'];
        constructor(private $rootScope: ng.IRootScopeService){
        }

        connect() {
            this.socket = io();
            this.socket.on('playerJoined', (data) => {
                this.$rootScope.$emit('playerJoined', data);
            });
            this.socket.on('otherPlayerJoined', (playerData: IPlayerData) => {
                this.$rootScope.$emit('otherPlayerJoined', playerData);
            });
            this.socket.on('updatePlayerPositions', (updatedPlayers) => {
                this.$rootScope.$emit('updatePlayerPositions', updatedPlayers);
            });
            this.socket.on('commandResponse', (response: string) => {
                this.$rootScope.$emit('commandResponse', response);
            });
            this.socket.on('chatMessageToClients', (message: IChatMessage) => {
                this.$rootScope.$emit('chatMessageToClients', message);
            });
            this.socket.on('otherPlayerLeft', (playerId: string) => {
                this.$rootScope.$emit('otherPlayerLeft', playerId);
            });
        }

        commandToServer(message: string){
            this.socket.emit('commandToServer', message);
        }
        chatMessageToServer(message: IChatMessage){
            this.socket.emit('chatMessageToServer', message);
        }
        playerPositionToServer(message: IPlayerData){
            this.socket.emit('playerPositionToServer', message);
        }
    }

    app.service('socketService', SocketService);
}