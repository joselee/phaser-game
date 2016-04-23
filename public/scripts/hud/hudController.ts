namespace PhaserGame {
    class HudController {
        showChat: boolean = false;
        messages: ChatMessage[];

        static $inject = ['$rootScope'];
        constructor($rootScope: ng.IRootScopeService) {
            $rootScope.$on('toggleGameCaptureInput', (event, enabled) => {
                this.showChat = !enabled;
                $rootScope.$apply();
            });
        }
    }

    app.controller('hudController', HudController);

    class ChatMessage {
        timestamp: Date;
        playerName: string;
        text: string;
    }
}