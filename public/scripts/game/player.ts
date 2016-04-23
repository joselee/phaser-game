namespace PhaserGame {
    export class Player extends Phaser.Sprite {
        game: IPhaserAngularGame;
        animationSpeed: number = 10;
        movementSpeed: number = 100;
        controls: IKeyboardControls;
        
        constructor(game: IPhaserAngularGame, x: number, y: number, spriteSheetId: string, private mapLayers: IMapLayers){
            super(game, x, y, spriteSheetId);
            this.game = game;

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

            this.game.physics.arcade.enable(this);
        }

        update() {
            super.update();

            let up = this.controls.up.isDown || this.controls.w.isDown;
            let down = this.controls.down.isDown || this.controls.s.isDown;
            let left = this.controls.left.isDown || this.controls.a.isDown;
            let right = this.controls.right.isDown || this.controls.d.isDown;

            this.body.velocity.y = 0;
            this.body.velocity.x = 0;


            if (up) {
                this.animations.play('walkUp', this.animationSpeed, true);
                this.body.velocity.y = -this.movementSpeed;
            }
            else if (down) {
                this.animations.play('walkDown', this.animationSpeed, true);
                this.body.velocity.y = this.movementSpeed;
            }

            if (left) {
                if (!up && !down) { // Up & down animations take precedence over left & right
                    this.animations.play('walkLeft', this.animationSpeed, true);
                }
                this.body.velocity.x = -this.movementSpeed;
            }
            else if (right) {
                if (!up && !down) { // Up & down animations take precedence over left & right
                    this.animations.play('walkRight', this.animationSpeed, true);
                }
                this.body.velocity.x = this.movementSpeed;
            }

            if (!up && !down && !left && !right) {
                this.animations.stop();
            }

            this.game.physics.arcade.collide(this, this.mapLayers.blockedLayer);
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