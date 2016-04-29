namespace PhaserGame {
    export class OtherPlayer extends Phaser.Sprite {
        game: IPhaserAngularGame;
        animationSpeed: number = 10;
        movementSpeed: number = 100;
        lastPlayerData: IPlayerData;
        playerId: string;

        constructor(game: IPhaserAngularGame, playerData:IPlayerData, spriteSheetId: string, private mapLayers: IMapLayers) {
            super(game, playerData.posX, playerData.posY, spriteSheetId);
            this.game = game;
            this.playerId = playerData.id;

            this.animations.add('walkDown', [0, 1, 2]);
            this.animations.add('walkLeft', [3, 4, 5]);
            this.animations.add('walkRight', [6, 7, 8]);
            this.animations.add('walkUp', [9, 10, 11]);
        }

        movePlayer(playerData: IPlayerData) {
            this.position.x = playerData.posX;
            this.position.y = playerData.posY;
        }
        animateMovement(velocity) {
            // Vertical movement
            if (velocity.y < 0)
                this.animations.play('walkUp', this.animationSpeed, true);
            else if (velocity.y > 0)
                this.animations.play('walkDown', this.animationSpeed, true);

            // Horizontal movement
            if (velocity.x < 0 && velocity.y === 0)
                this.animations.play('walkLeft', this.animationSpeed, true);
            else if (velocity.x > 0 && velocity.y === 0)
                this.animations.play('walkRight', this.animationSpeed, true);

            // No movement
            if (velocity.x === 0 && velocity.y === 0)
                this.animations.stop();
        }
    }
}