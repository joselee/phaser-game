namespace PhaserGame {
    export class SocketService {
        socket: SocketIOClient.Socket;
        static $inject = ['$rootScope'];
        constructor(private $rootScope: ng.IRootScopeService){
        }

        connect() {
            this.socket = io();
            this.socket.on('connect', () => {
                // console.log('connected.. logging in');
                this.socket.emit('playerJoined');
            });
            this.socket.on('playerJoined', (data) => {
                // console.log('playerJoined');
                this.$rootScope.$emit('playerJoined', data);
            });
            this.socket.on('otherPlayerJoined', (playerData: IPlayerData) => {
                // console.log('otherPlayerJoined');
                this.$rootScope.$emit('otherPlayerJoined', playerData);
            });
            this.socket.on('updatePlayerPositions', (updatedPlayers) => {
                // console.log('updatePlayerPositions');
                this.$rootScope.$emit('updatePlayerPositions', updatedPlayers);
            });
            this.socket.on('chatMessageToClients', (message: IChatMessage) => {
                // console.log('chatMessageToClients');
                this.$rootScope.$emit('chatMessageToClients', message);
            });
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