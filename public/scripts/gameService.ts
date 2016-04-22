namespace Game {
    export class GameService {
        getFoo(){
            return 'foo';
        }
    }
    gameModule.service('gameService', GameService);
}