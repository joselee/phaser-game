var player;
var map;
var bgLayer;
var controls;

var game = new Phaser.Game(480, 320, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('world', 'assets/world.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('worldpng', 'assets/worldpng.png');
    game.load.spritesheet('player', 'assets/player.png', 32, 32);
}
function create() {
    map = game.add.tilemap('world');
    map.addTilesetImage('worldpng', 'worldpng');
    bgLayer = map.createLayer('bg');

    player = game.add.sprite(240, 160, 'player');
    player.animations.add('walkDown', [0, 1, 2]);
    player.animations.add('walkLeft', [3, 4, 5]);
    player.animations.add('walkRight', [6, 7, 8]);
    player.animations.add('walkUp', [9, 10, 11]);
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    game.physics.arcade.enable(player);

    controls = {
        up: {
            key: game.input.keyboard.addKey(Phaser.Keyboard.UP),
            direction: 'y',
            velocity: -100,
            animation: 'walkUp'
        },
        down: {
            key: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            direction: 'y',
            velocity: 100,
            animation: 'walkDown'
        },
        left: {
            key: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            direction: 'x',
            velocity: -100,
            animation: 'walkLeft'
        },
        right: {
            key: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            direction: 'x',
            velocity: 100,
            animation: 'walkRight'
        }
    }

    _.each(controls, function (control) {
        control.key.onDown.add(function () {
            player.body.velocity[control.direction] += control.velocity;
        });
        control.key.onUp.add(function () {
            player.body.velocity[control.direction] -= control.velocity;
        });
    });
}
function update() {
    var x = player.body.velocity.x;
    var y = player.body.velocity.y;

    // Vertical movement
    if (y === controls.up.velocity) {
        player.animations.play(controls.up.animation, 10, true);
    }
    else if (y === controls.down.velocity) {
        player.animations.play(controls.down.animation, 10, true);
    }

    // Horizontal movement
    if (x === controls.left.velocity && y === 0) {
        player.animations.play(controls.left.animation, 10, true);
    }
    else if (x === controls.right.velocity && y === 0) {
        player.animations.play(controls.right.animation, 10, true);
    }

    // No movement
    if (x === 0 && y === 0) {
        player.animations.stop();
    }
}