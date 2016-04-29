namespace PhaserGame {
    export class OtherPlayer extends Phaser.Sprite {
        game: IPhaserAngularGame;
        animationSpeed: number = 10;
        playerId: string;

        constructor(game: IPhaserAngularGame, playerData:IPlayerData, spriteSheetId: string, private mapLayers: IMapLayers) {
            super(game, playerData.posX, playerData.posY, spriteSheetId);
            this.game = game;
            this.game.physics.arcade.enable(this);
            this.playerId = playerData.id;

            this.animations.add('walkDown', [0, 1, 2]);
            this.animations.add('walkLeft', [3, 4, 5]);
            this.animations.add('walkRight', [6, 7, 8]);
            this.animations.add('walkUp', [9, 10, 11]);
        }
        
        movePlayer(playerData: IPlayerData) {
            this.position.x = playerData.posX;
            this.position.y = playerData.posY;
            this.animations.play(playerData.animation, this.animationSpeed, true);
            if (!playerData.animationPlaying) {
                this.animations.stop();
            }
        }
    }
}