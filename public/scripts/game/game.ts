namespace PhaserGame {
    export class Game extends Phaser.State{
        game: IPhaserAngularGame;
        map: Phaser.Tilemap;
        mapLayers: IMapLayers;
        player: PhaserGame.Player;
        players: {[playerId: string]: PhaserGame.OtherPlayer};

        constructor($rootScope: ng.IRootScopeService, socketService: SocketService) {
            super();
            //16:9 aspect ratio
            this.game = new Phaser.Game(720, 405, Phaser.AUTO, 'game', {
                init: this.init,
                preload: this.preload,
                create: this.create
            });
            this.game.rootScope = $rootScope;
            this.game.socketService = socketService;
        }

        init() {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;

            if (this.game.device.desktop) {
                this.scale.setMinMax(0, 0, 720, 405);
            } else {
                this.game.scale.setGameSize(405, 575);
                this.scale.setMinMax(0, 0, 1024, 1024);
                this.scale.forceOrientation(false, true);
                this.scale.enterIncorrectOrientation.add(()=>{
                    //Show 'go to portrait' dialog
                    alert('Hey, you should turn your mobile device to portrait mode for a better experience.');
                });
                this.scale.leaveIncorrectOrientation.add(()=>{
                    //Hide 'go to portrait' dialog
                });
            }
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

            // Listens for angular event to toggle game keyboard bindings.
            this.game.rootScope.$on('setFocusToChat', (event, chatFocused) => {
                this.game.input.keyboard.enabled = !chatFocused; // Game consumes keyboard input only if chat doesn't have focus
                this.game.input.keyboard.reset(false);
            });

            this.game.rootScope.$on('playerJoined', (event, data) => {
                // Instantiate the player.
                let playerData: IPlayerData = data.players[data.id];
                this.player = new Player(this.game, playerData, 'girl', this.mapLayers);
                this.game.rootScope.$emit('addMessageToMessageBox', {type: 'system', text: 'You have joined as ' + this.player.playerName});
                this.game.add.existing(this.player);
                this.game.camera.follow(this.player);
                this.players = {};

                // Instantiate other players already in the game
                for (let playerId in data.players) {
                    if (playerId !== this.player.playerId) {
                        this.game.rootScope.$emit('otherPlayerJoined', data.players[playerId]);
                    }
                }
            });
            
            this.game.rootScope.$on('otherPlayerJoined', (event, playerData: IPlayerData) => {
                let otherPlayer = new OtherPlayer(this.game, playerData, 'girl', this.mapLayers);
                this.game.add.existing(otherPlayer);
                this.players[playerData.id] = otherPlayer;
            });

            this.game.rootScope.$on('updatePlayerPositions', (event, updatedPlayers) => {
                for (let playerId in updatedPlayers) {
                    if (playerId !== this.player.playerId) {
                        let otherPlayer = this.players[playerId];
                        let updatedData = updatedPlayers[playerId];
                        otherPlayer.movePlayer(updatedData);
                    }
                }
            });

            this.game.rootScope.$on('otherPlayerLeft', (event, playerId) => {
                if(this.players[playerId])
                    this.players[playerId].destroy();
            });
            
            this.game.socketService.connect();
        }
    }

    export interface IPhaserAngularGame extends Phaser.Game {
        rootScope?: ng.IRootScopeService;
        socketService?: SocketService;
        target?: any;
    }

    export interface IMapLayers {
        bgLayer: Phaser.TilemapLayer;
        rocksLayer: Phaser.TilemapLayer;
        plantsLayer: Phaser.TilemapLayer;
        blockedLayer: Phaser.TilemapLayer;
    }
}