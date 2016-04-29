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
            //this.game.physics.arcade.enable(this);

            this.animations.add('walkDown', [0, 1, 2]);
            this.animations.add('walkLeft', [3, 4, 5]);
            this.animations.add('walkRight', [6, 7, 8]);
            this.animations.add('walkUp', [9, 10, 11]);
        }

        update() {
            super.update();
            // this.game.physics.arcade.collide(this, this.mapLayers.blockedLayer);
            // let velocity = this.body.velocity;
            // this.movePlayer(velocity);
            // this.animateMovement(velocity);
        }
        movePlayer(newData) {
            this.position.x = newData.posX;
            this.position.y = newData.posY;
            // Stop movement on each frame before deciding to move
            // velocity.y = 0;
            // velocity.x = 0;

            // // Vertical movement
            // if (up && down)
            //     velocity.y = 0;
            // else if (up)
            //     velocity.y = -this.movementSpeed;
            // else if (down)
            //     velocity.y = this.movementSpeed;

            // // Horizontal movement
            // if (left && right)
            //     velocity.x = 0;
            // else if (left)
            //     velocity.x = -this.movementSpeed;
            // else if (right)
            //     velocity.x = this.movementSpeed;
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