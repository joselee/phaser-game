namespace Game {
    export class GameController {
        foo: string;
        game: Game;
        
        static $inject = ['gameService', '$rootScope'];
        constructor(private gameService: GameService, private $rootScope: ng.IRootScopeService) {
            this.foo = gameService.getFoo();
            this.game = new Game($rootScope);
        }
    }
    gameModule.controller('gameController', GameController);
}