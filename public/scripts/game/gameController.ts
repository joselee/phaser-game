namespace PhaserGame {
    export class GameController {
        game: Game;

        static $inject = ['$rootScope', 'socketService'];
        constructor(private $rootScope: ng.IRootScopeService,
                    private socketService: SocketService) {
            this.game = new Game(this.$rootScope, this.socketService);
        }
    }
    app.controller('gameController', GameController);
}