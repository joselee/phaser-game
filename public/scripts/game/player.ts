namespace PhaserGame {
    export class Player extends Phaser.Sprite {
        game: IPhaserAngularGame;
        animationSpeed: number = 10;
        movementSpeed: number = 100;
        movementControls;
        
        constructor(game: IPhaserAngularGame, x: number, y: number, spriteSheetId: string, private mapLayers: IMapLayers){
            super(game, x, y, spriteSheetId);
            this.game = game;
            this.game.physics.arcade.enable(this);
            this.addAnimations();
            this.setupMovementControls();
        }
        addAnimations() {
            this.animations.add('walkDown', [0, 1, 2]);
            this.animations.add('walkLeft', [3, 4, 5]);
            this.animations.add('walkRight', [6, 7, 8]);
            this.animations.add('walkUp', [9, 10, 11]);
        }
        setupMovementControls (){
            this.movementControls = {
                up: {
                    key: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
                    axis: 'y',
                    velocity: -this.movementSpeed,
                    animation: 'walkUp'
                },
                down: {
                    key: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
                    axis: 'y',
                    velocity: this.movementSpeed,
                    animation: 'walkDown'
                },
                left: {
                    key: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
                    axis: 'x',
                    velocity: -this.movementSpeed,
                    animation: 'walkLeft'
                },
                right: {
                    key: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
                    axis: 'x',
                    velocity: this.movementSpeed,
                    animation: 'walkRight'
                },
            };

            for (let id in this.movementControls){
                let control: IMovementControl = this.movementControls[id];
                control.key.onDown.add(() => {
                    this.body.velocity[control.axis] += control.velocity;
                });
                control.key.onUp.add(() => {
                    this.body.velocity[control.axis] -= control.velocity;
                });
            }
        }
        update() {
            super.update();
            let x = this.body.velocity.x;
            let y = this.body.velocity.y;
            let mc = this.movementControls;
            
            // Vertical movement
            if (y === mc.up.velocity) {
                this.animations.play(mc.up.animation, this.animationSpeed, true);
            }
            else if (y === mc.down.velocity) {
                this.animations.play(mc.down.animation, this.animationSpeed, true);
            }
            // Horizontal movement
            if (x === mc.left.velocity && y === 0) {
                this.animations.play(mc.left.animation, this.animationSpeed, true);
            }
            else if (x === mc.right.velocity && y === 0) {
                this.animations.play(mc.right.animation, this.animationSpeed, true);
            }
            // No movement
            if (x === 0 && y === 0) {
                this.animations.stop();
            }

            this.game.physics.arcade.collide(this, this.mapLayers.blockedLayer);
        }
        resetMovementControls() {
            for (let id in this.movementControls){
                this.movementControls[id].key.reset();
            }
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.animations.stop();
        }
    }
    interface IMovementControl {
        key: Phaser.Key;
        axis: string;
        velocity: number;
        animation: string;
    }
}