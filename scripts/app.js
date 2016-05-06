var map;
var player;
var controls;
var target;
var layers = {};
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game', { init: init, preload: preload, create: create, update: update, render: render });

function init() {
    var self = this;
    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    
    this.scale.setResizeCallback(_.debounce(function(){
        self.scale.setGameSize(window.innerWidth, window.innerHeight);
        self.scale.refresh();
    }, 1000), this);
}

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
    layers.bg.resizeWorld();
    game.camera.follow(player);

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
    game.input.onDown.add(function (pointer) {
        var threshold = 2;
        target = { 
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
}
function update() {
    game.physics.arcade.collide(player, layers.collision);
    movePlayer();
    animateMovement();
}

function render() {
    // game.debug.bodyInfo(player);
    // game.debug.body(player);
}

function movePlayer () {
    var velocity = player.body.velocity;
    velocity.y = 0;
    velocity.x = 0;

    var up = controls.up.isDown || controls.w.isDown;
    var down = controls.down.isDown || controls.s.isDown;
    var left = controls.left.isDown || controls.a.isDown;
    var right = controls.right.isDown || controls.d.isDown;

    // Keyboard movement
    if (up)
        velocity.y = -100;
    else if (down)
        velocity.y = 100;
    if (left)
        velocity.x = -100;
    else if (right)
        velocity.x = 100;

    // Mouse click movement
    if (target && !(up || down || left || right)) {
        var x = player.position.x;
        var y = player.position.y;
        var xMin = target.x.min;
        var xMax = target.x.max;
        var yMin = target.y.min;
        var yMax = target.y.max;

        // Decide which directions to move in by comparing current position and target position
        if (x < xMin)
            velocity.x = 100;
        else if (x > xMax)
            velocity.x = -100;
        if (y < yMin)
            velocity.y = 100;
        else if (y > yMax)
            velocity.y = -100;
            
        // Destination reached
        if (x > xMin && x < xMax && y > yMin && y < yMax)
            target = null;
    }
}

function animateMovement() {
    var velocity = player.body.velocity;
    // Vertical movement
    if (velocity.y < 0)
        player.animations.play('walkUp', 10, true);
    else if (velocity.y > 0)
        player.animations.play('walkDown', 10, true);

    // Horizontal movement
    if (velocity.x < 0 && velocity.y === 0)
        player.animations.play('walkLeft', 10, true);
    else if (velocity.x > 0 && velocity.y === 0)
        player.animations.play('walkRight', 10, true);

    // No movement
    if (velocity.x === 0 && velocity.y === 0)
        player.animations.stop();
}