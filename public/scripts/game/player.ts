namespace PhaserGame {
    export class Player extends Phaser.Sprite {
        game: IPhaserAngularGame;
        animationSpeed: number = 10;
        movementSpeed: number = 100;
        controls: IKeyboardControls;

        constructor(game: IPhaserAngularGame, x: number, y: number, spriteSheetId: string, private mapLayers: IMapLayers) {
            super(game, x, y, spriteSheetId);
            this.game = game;
            this.game.physics.arcade.enable(this);

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

        }

        update() {
            super.update();
            this.game.physics.arcade.collide(this, this.mapLayers.blockedLayer);
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