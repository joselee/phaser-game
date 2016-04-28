namespace PhaserGame {
    export class GameController {
        foo: string;
        game: Game;
        
        static $inject = ['gameService', '$rootScope', 'socketService'];
        constructor(private gameService: GameService,
                    private $rootScope: ng.IRootScopeService,
                    private socketService: SocketService) {
            this.foo = gameService.getFoo();
            this.game = new Game($rootScope);
        }
    }
    app.controller('gameController', GameController);
}