namespace Game {
    export class Game {
        game: Phaser.Game;
        girl: Phaser.Sprite;
        controls: KeyboardControls;
        lastMove: MovementDirection;

        constructor() {
            this.game = new Phaser.Game(600, 400, Phaser.AUTO, 'game', {
                preload: this.preload,
                create: this.create,
                update: this.update
            });
        }

        preload() {
            this.game.load.spritesheet('girl', 'assets/character_girl_5.png', 32, 32);
        }
        create() {
            this.girl = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'girl');
            this.girl.animations.add('walkDown', [0, 1, 2]);
            this.girl.animations.add('walkLeft', [3, 4, 5]);
            this.girl.animations.add('walkRight', [6, 7, 8]);
            this.girl.animations.add('walkUp', [9, 10, 11]);

            this.controls = {
                up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
                down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
                left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
                right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
            };
        }
        update() {
            if (this.controls.up.isDown) {
                this.girl.animations.play('walkUp', 10, true);
                this.girl.y--;
                this.lastMove = MovementDirection.up;
            }
            else if (this.controls.down.isDown) {
                this.girl.y++;
                this.girl.animations.play('walkDown', 10, true);
                this.lastMove = MovementDirection.down;
            }
            else if (this.controls.left.isDown) {
                this.girl.x--;
                this.girl.animations.play('walkLeft', 10, true);
                this.lastMove = MovementDirection.left;
            }
            else if (this.controls.right.isDown) {
                this.girl.x++;
                this.girl.animations.play('walkRight', 10, true);
                this.lastMove = MovementDirection.right;
            }
            else {
                this.girl.animations.stop();
            }
        }
    }

    interface KeyboardControls {
        up: Phaser.Key;
        down: Phaser.Key;
        left: Phaser.Key;
        right: Phaser.Key;
    }

    enum MovementDirection { up, down, left, right }
}