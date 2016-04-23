namespace Game {
    export class Game {
        scale: Phaser.ScaleManager;
        game: Phaser.Game;
        map: Phaser.Tilemap;
        bgLayer: Phaser.TilemapLayer;
        rocksLayer: Phaser.TilemapLayer;
        plantsLayer: Phaser.TilemapLayer;
        blockedLayer: Phaser.TilemapLayer;
        girl: Phaser.Sprite;
        controls: KeyboardControls;

        constructor() {
            this.game = new Phaser.Game(600, 400, Phaser.AUTO, 'game', {
                preload: this.preload,
                create: this.create,
                update: this.update
            });
        }

        preload() {
            this.game.load.tilemap('world_tilemap', 'assets/world_tilemap.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('tileset_nature_1', 'assets/tileset_nature_1.png');
            this.game.load.spritesheet('girl', 'assets/character_girl_5.png', 32, 32);
        }
        create() {
            // Load the tilemap world_tilemap.json, and the image asset(s) it needs 
            this.map = this.game.add.tilemap('world_tilemap');
            this.map.addTilesetImage('tileset_nature_1', 'tileset_nature_1');

            // Render the layers- IDs are defined in the tilemap
            this.bgLayer = this.map.createLayer('bgLayer');
            this.rocksLayer = this.map.createLayer('rocksLayer');
            this.plantsLayer = this.map.createLayer('plantsLayer');
            this.blockedLayer = this.map.createLayer('blockedLayer');

            // set blockedLayer as invisible collision layer
            this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
            this.blockedLayer.alpha = 0;
            this.bgLayer.resizeWorld(); // set world boundaries to map size

            this.girl = this.game.add.sprite(180, 300, 'girl');
            this.girl.animations.add('walkDown', [0, 1, 2]);
            this.girl.animations.add('walkLeft', [3, 4, 5]);
            this.girl.animations.add('walkRight', [6, 7, 8]);
            this.girl.animations.add('walkUp', [9, 10, 11]);

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

            //the camera will follow the player in the world
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.enable(this.girl);
            this.game.camera.follow(this.girl);
        }
        update() {
            let up = this.controls.up.isDown       || this.controls.w.isDown;
            let down = this.controls.down.isDown   || this.controls.s.isDown;
            let left = this.controls.left.isDown   || this.controls.a.isDown;
            let right = this.controls.right.isDown || this.controls.d.isDown;

            this.girl.body.velocity.y = 0;
            this.girl.body.velocity.x = 0;
            
            if (up) {
                if(!left && !right){
                    this.girl.animations.play('walkUp', 10, true);
                }
                this.girl.body.velocity.y = -150;
            }
            else if (down) {
                if(!left && !right){
                    this.girl.animations.play('walkDown', 10, true);
                }
                this.girl.body.velocity.y = 150;
            }

            if (left) {
                this.girl.animations.play('walkLeft', 10, true);
                this.girl.body.velocity.x = -150;
            }
            else if (right) {
                this.girl.animations.play('walkRight', 10, true);
                this.girl.body.velocity.x = 150;
            }

            if (!up && !down && !left && !right) {
                this.girl.animations.stop();
            }

            this.game.physics.arcade.collide(this.girl, this.blockedLayer);
            // this.game.physics.arcade.overlap(this.girl, this.items, this.collect, null, this);
            // this.game.physics.arcade.overlap(this.girl, this.doors, this.enterDoor, null, this);
        }
    }

    interface KeyboardControls {
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