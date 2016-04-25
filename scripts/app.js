var player;
var keys;
var map;
var bgLayer;
var collisionLayer;
var topLayer;
var upKey;
var downKey;
var leftKey;
var rightKey;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('world', 'assets/world.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('worldpng', 'assets/worldpng.png');
    game.load.spritesheet('player', 'assets/player.png', 32, 32);
}
function create() {
    map = game.add.tilemap('world');
    map.addTilesetImage('worldpng', 'worldpng');
    bgLayer = map.createLayer('bg');
    topLayer = map.createLayer('top');
    collisionLayer = map.createLayer('collision');
    map.setCollisionBetween(1, 10000, true, 'collision');
    collisionLayer.alpha = 0;
    
    player = game.add.sprite(300, 300, 'player');
    player.animations.add('walkDown', [0, 1, 2]);
    player.animations.add('walkLeft', [3, 4, 5]);
    player.animations.add('walkRight', [6, 7, 8]);
    player.animations.add('walkUp', [9, 10, 11]);
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    game.physics.arcade.enable(player);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}
function update() {
    player.body.velocity.y = 0;
    player.body.velocity.x = 0;
    
    if (upKey.isDown){
        player.animations.play('walkUp', 10, true);
        player.body.velocity.y = -100;
    } else if (downKey.isDown) {
        player.animations.play('walkDown', 10, true);
        player.body.velocity.y = 100;
    } else if (leftKey.isDown){
        player.animations.play('walkLeft', 10, true);
        player.body.velocity.x = -100;
    } else if (rightKey.isDown) {
        player.animations.play('walkRight', 10, true);
        player.body.velocity.x = 100;
    } else {
        player.animations.stop();
    }
    game.physics.arcade.collide(player, collisionLayer);
}