namespace PhaserGame {
    class HudController {
        showChat: boolean = false;
        playerName: string;
        message: string = '';
        messages: ChatMessage[] = [];

        static $inject = ['$rootScope'];
        constructor($rootScope: ng.IRootScopeService) {
            $rootScope.$on('toggleGameCaptureInput', (event, enabled) => {
                this.showChat = !enabled;
                $rootScope.$apply();
            });

            this.setPlayerName();
            this.messages.push({playerName: '', text: 'Welcome!'});
            this.messages.push({playerName: '', text: 'You have joined as: ' + this.playerName});
        }

        sendChatMessage() {
            if(this.message){
                this.messages.push({playerName: this.playerName, text: this.message});
                this.message = '';
            }
        }
        
        setPlayerName() {
            let tempName = 'Player_' + Math.floor(1+Math.random() * 100000);
            // let nickname = prompt('Enter a nickname:');
            this.playerName = tempName;
        }
    }

    app.controller('hudController', HudController);

    class ChatMessage {
        playerName: string;
        text: string;
    }
}