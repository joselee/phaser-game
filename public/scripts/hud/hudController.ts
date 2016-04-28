namespace PhaserGame {
    class HudController {
        playerName: string;
        message: string = '';
        messages: IChatMessage[] = [];

        static $inject = ['$rootScope', 'socketService'];
        constructor($rootScope: ng.IRootScopeService, private socketService: SocketService) {
            this.setPlayerName();
            this.messages.push({playerName: '', text: 'Welcome!'});
            this.messages.push({playerName: '', text: 'You have joined as: ' + this.playerName});

            $rootScope.$on('chatMessageToClients', (event: ng.IAngularEvent, message: IChatMessage) => {
                $rootScope.$apply(() => {
                    this.messages.push(message)
                });
            });
        }

        chatMessageToServer() {
            if(this.message){
                this.socketService.chatMessageToServer({playerName: this.playerName, text: this.message});
            }
            this.message = '';
        }
        
        setPlayerName() {
            let tempName = 'Player_' + Math.floor(1+Math.random() * 100000);
            // let nickname = prompt('Enter a nickname:');
            this.playerName = tempName;
        }
    }

    app.controller('hudController', HudController);
}