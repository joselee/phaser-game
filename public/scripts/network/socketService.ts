namespace PhaserGame {
    export class SocketService {
        socket: SocketIOClient.Socket;
        static $inject = ['$rootScope'];
        constructor(private $rootScope: ng.IRootScopeService) {
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
                this.$rootScope.$emit('addMessageToMessageBox', message);
            });
            this.socket.on('otherPlayerLeft', (playerId: string) => {
                this.$rootScope.$emit('otherPlayerLeft', playerId);
            });
        }

        commandToServer(message: string) {
            this.socket.emit('commandToServer', message);
        }
        chatMessageToServer(message: string) {
            this.socket.emit('chatMessageToServer', message);
        }
        updatePlayerData(message: IPlayerData) {
            this.socket.emit('updatePlayerData', message);
        }
        changeNick(nick: string) {
            this.socket.emit('changeNick', nick);
        }
    }

    app.service('socketService', SocketService);
}