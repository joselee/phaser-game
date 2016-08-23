namespace PhaserGame {
    export class Player extends Phaser.Sprite {
        game: IPhaserAngularGame;
        animationSpeed: number = 10;
        movementSpeed: number = 100;
        controls: IKeyboardControls;
        lastPlayerData: IPlayerData;
        playerId: string;
        playerName: string;

        constructor(game: IPhaserAngularGame, spriteSheetId: string, private mapLayers) {
            super(game, 300, 180, spriteSheetId);
            this.game = game;
            this.game.physics.arcade.enable(this);
            this.anchor.set(0.5);
            this.game.target = null;

            this.animations.add('walkDown', [0, 1, 2]);
            this.animations.add('walkLeft', [3, 4, 5]);
            this.animations.add('walkRight', [6, 7, 8]);
            this.animations.add('walkUp', [9, 10, 11]);

            this.controls = {
                up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
                down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
                left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
                right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
                w: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
                s: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
                a: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
                d: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
            };
            this.game.input.onDown.add((pointer) => {
                let threshold = 2;
                this.game.target = { 
                    x: {
                        min: pointer.worldX - threshold,
                        max: pointer.worldX + threshold
                    },
                    y: {
                        min: pointer.worldY - threshold,
                        max: pointer.worldY + threshold
                    }
                };
            }, this);

            this.sendUpdateToServer();
        }

        setPlayerData(playerData:IPlayerData) {
            this.playerId = playerData.id;
            this.playerName = playerData.playerName;
        }

        update() {
            super.update();
            this.game.physics.arcade.collide(this, this.mapLayers.collision);
            let velocity = this.body.velocity;
            this.movePlayer(velocity);
            this.animateMovement(velocity);
        }
        movePlayer(velocity) {
            let up = this.controls.up.isDown || this.controls.w.isDown;
            let down = this.controls.down.isDown || this.controls.s.isDown;
            let left = this.controls.left.isDown || this.controls.a.isDown;
            let right = this.controls.right.isDown || this.controls.d.isDown;

            // Stop movement on each frame before deciding to move
            velocity.y = 0;
            velocity.x = 0;

            // Vertical movement
            if (up && down)
                velocity.y = 0;
            else if (up)
                velocity.y = -this.movementSpeed;
            else if (down)
                velocity.y = this.movementSpeed;

            // Horizontal movement
            if (left && right)
                velocity.x = 0;
            else if (left)
                velocity.x = -this.movementSpeed;
            else if (right)
                velocity.x = this.movementSpeed;

            // Mouse click movement - Keyboard movement interrupts mouse movement
            if (this.game.target !== null && !(up || down || left || right)) {
                let x = this.position.x;
                let y = this.position.y;
                let xMin = this.game.target.x.min;
                let xMax = this.game.target.x.max;
                let yMin = this.game.target.y.min;
                let yMax = this.game.target.y.max;

                // Decide which directions to move in by comparing current position and target position
                if (x < xMin)
                    velocity.x = this.movementSpeed;
                else if (x > xMax)
                    velocity.x = -this.movementSpeed;
                if (y < yMin)
                    velocity.y = this.movementSpeed;
                else if (y > yMax)
                    velocity.y = -this.movementSpeed;
                    
                // Destination reached
                if (x > xMin && x < xMax && y > yMin && y < yMax)
                    this.game.target = null;
            }
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
        sendUpdateToServer() {
            setInterval(() => {
                let updatedPlayerData: IPlayerData = {
                    id: this.playerId,
                    playerName: this.playerName,
                    posX: this.body.position.x,
                    posY: this.body.position.y,
                    animation: this.animations.currentAnim.name,
                    animationPlaying: this.animations.currentAnim.isPlaying
                }

                if(!angular.equals(this.lastPlayerData, updatedPlayerData)){
                    this.lastPlayerData = updatedPlayerData;
                    this.game.socketService.updatePlayerData(updatedPlayerData);
                }
            }, 1000/60);
        }
    }

    interface IKeyboardControls {
        up: Phaser.Key;
        down: Phaser.Key;
        left: Phaser.Key;
        right: Phaser.Key;
        w: Phaser.Key;
        s: Phaser.Key;
        a: Phaser.Key;
        d: Phaser.Key;
    }
}