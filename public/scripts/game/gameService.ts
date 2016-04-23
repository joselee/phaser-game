namespace PhaserGame {
    export class GameService {
        getFoo(){
            return 'foo';
        }
    }
    app.service('gameService', GameService);
}