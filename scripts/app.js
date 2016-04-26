var player;
var map;
var bgLayer;
var controls;

var game = new Phaser.Game(480, 480, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('world', 'assets/world.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('worldpng', 'assets/worldpng.png');
    game.load.spritesheet('player', 'assets/player.png', 32, 32);
}
function create() {
    map = game.add.tilemap('world');
    map.addTilesetImage('worldpng', 'worldpng');
    bgLayer = map.createLayer('bg');
    
    player = game.add.sprite(300, 300, 'player');
    player.animations.add('walkDown', [0, 1, 2]);
    player.animations.add('walkLeft', [3, 4, 5]);
    player.animations.add('walkRight', [6, 7, 8]);
    player.animations.add('walkUp', [9, 10, 11]);
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    game.physics.arcade.enable(player);
    
    this.controls = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
        down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
        left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
        right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        w: game.input.keyboard.addKey(Phaser.Keyboard.W),
        s: game.input.keyboard.addKey(Phaser.Keyboard.S),
        a: game.input.keyboard.addKey(Phaser.Keyboard.A),
        d: game.input.keyboard.addKey(Phaser.Keyboard.D)
    }
}
function update() {
    var up = this.controls.up.isDown || this.controls.w.isDown;
    var down = this.controls.down.isDown || this.controls.s.isDown;
    var left = this.controls.left.isDown || this.controls.a.isDown;
    var right = this.controls.right.isDown || this.controls.d.isDown;
    
    player.body.velocity.y = 0;
    player.body.velocity.x = 0;
    
    if (up){
        player.animations.play('walkUp', 10, true);
        player.body.velocity.y = -100;
    } else if (down) {
        player.animations.play('walkDown', 10, true);
        player.body.velocity.y = 100;
    }
    
    if (left){
        if(!up && !down){
            player.animations.play('walkLeft', 10, true);
        }
        player.body.velocity.x = -100;
    } else if (right) {
        if(!up && !down){
            player.animations.play('walkRight', 10, true);
        }
        player.body.velocity.x = 100;
    }
    
    if(!up && !down && !left && !right) {
        player.animations.stop();
    }
}