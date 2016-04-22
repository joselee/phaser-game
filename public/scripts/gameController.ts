namespace Game {
    export class GameController {
        foo: string;
        game: Game;
        
        static $inject = ['gameService'];
        constructor(gameService: GameService) {
            this.foo = gameService.getFoo();
            this.game = new Game();
        }
    }
    game.controller('gameController', GameController);
}