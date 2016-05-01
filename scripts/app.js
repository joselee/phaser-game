var map;
var player;
var controls;
var layers = {};
var game = new Phaser.Game(480, 320, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    // Load map json, and all pngs used by map
    game.load.tilemap('world', 'assets/world2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('worldpng', 'assets/worldpng.png');
    game.load.image('tree', 'assets/tree.png');
    game.load.image('collision', 'assets/collision.png');
    game.load.spritesheet('player', 'assets/player.png', 32, 32);
}
function create() {
    map = game.add.tilemap('world');
    map.addTilesetImage('worldpng', 'worldpng');
    map.addTilesetImage('tree', 'tree');
    map.addTilesetImage('collision', 'collision');

    // Order of creating layers and adding sprites matter for z-index
    layers.bg = map.createLayer('bg');
    layers.treeTrunk = map.createLayer('treeTrunk');
    player = game.add.sprite(320, 160, 'player');
    layers.treeTop = map.createLayer('treeTop');
    layers.collision = map.createLayer('collision');
    layers.collision.alpha = 0;
    map.setCollisionBetween(1, 2000, true, 'collision');
    game.physics.arcade.enable(player);

    player.animations.add('walkDown', [0, 1, 2]);
    player.animations.add('walkLeft', [3, 4, 5]);
    player.animations.add('walkRight', [6, 7, 8]);
    player.animations.add('walkUp', [9, 10, 11]);
    player.anchor.x = 0.5;
    player.anchor.y = 1;
    player.body.width = 20;
    player.body.height = 25;

    controls = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
        down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
        left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
        right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        w: game.input.keyboard.addKey(Phaser.Keyboard.W),
        s: game.input.keyboard.addKey(Phaser.Keyboard.S),
        a: game.input.keyboard.addKey(Phaser.Keyboard.A),
        d: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };
}
function update() {
    game.physics.arcade.collide(player, layers.collision);

    player.body.velocity.y = 0;
    player.body.velocity.x = 0;

    var up = controls.up.isDown || controls.w.isDown;
    var down = controls.down.isDown || controls.s.isDown;
    var left = controls.left.isDown || controls.a.isDown;
    var right = controls.right.isDown || controls.d.isDown;

    if (up) {
        player.animations.play('walkUp', 10, true);
        player.body.velocity.y = -100;
    } else if (down) {
        player.animations.play('walkDown', 10, true);
        player.body.velocity.y = 100;
    }

    if (left) {
        if (!up && !down) {
            player.animations.play('walkLeft', 10, true);
        }
        player.body.velocity.x = -100;
    } else if (right) {
        if (!up && !down) {
            player.animations.play('walkRight', 10, true);
        }
        player.body.velocity.x = 100;
    }

    if (!up && !down && !left && !right) {
        player.animations.stop();
    }
}

function render() {
    // game.debug.bodyInfo(player);
    // game.debug.body(player);
} 