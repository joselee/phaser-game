namespace PhaserGame {
    export class Game {
        game: IPhaserAngularGame;
        map: Phaser.Tilemap;
        mapLayers: IMapLayers;

        constructor($rootScope: ng.IRootScopeService, socketService: SocketService) {
            this.game = new Phaser.Game(600, 400, Phaser.AUTO, 'game', {
                preload: this.preload,
                create: this.create
            });
            this.game.rootScope = $rootScope;
            this.game.socketService = socketService;
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

            // Render the layers defined in the tilemap, and collect them into an object for ease of use.
            this.mapLayers = {
                bgLayer: this.map.createLayer('bgLayer'),
                rocksLayer: this.map.createLayer('rocksLayer'),
                plantsLayer: this.map.createLayer('plantsLayer'),
                blockedLayer: this.map.createLayer('blockedLayer')
            };

            // set blockedLayer as invisible collision layer
            this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
            this.mapLayers.blockedLayer.alpha = 0;
            this.mapLayers.bgLayer.resizeWorld(); // set world boundaries to map size

            // Instantiate the player.
            let player = new Player(this.game, 180, 300, 'girl', this.mapLayers);
            this.game.add.existing(player);
            this.game.camera.follow(player);

            // Listens for angular event to toggle game keyboard bindings.
            this.game.rootScope.$on('setFocusToChat', (event, chatFocused) => {
                this.game.input.keyboard.enabled = !chatFocused; // Game consumes keyboard input only if chat doesn't have focus
                this.game.input.keyboard.reset(false);
            });
        }
    }

    export interface IPhaserAngularGame extends Phaser.Game {
        rootScope?: ng.IRootScopeService;
        socketService?: SocketService;
    }

    export interface IMapLayers {
        bgLayer: Phaser.TilemapLayer;
        rocksLayer: Phaser.TilemapLayer;
        plantsLayer: Phaser.TilemapLayer;
        blockedLayer: Phaser.TilemapLayer;
    }
}