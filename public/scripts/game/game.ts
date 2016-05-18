namespace PhaserGame {
    export class Game extends Phaser.State{
        game: IPhaserAngularGame;
        map: Phaser.Tilemap;
        mapLayers;
        player: PhaserGame.Player;
        players: {[playerId: string]: PhaserGame.OtherPlayer};

        constructor($rootScope: ng.IRootScopeService, socketService: SocketService) {
            super();
            //16:9 aspect ratio
            this.game = new Phaser.Game(720, 405, Phaser.AUTO, 'game', {
                init: this.init,
                preload: this.preload,
                create: this.create,
                render: this.render
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
        
        render() {
            if(this.player){
                this.game.debug.bodyInfo(this.player, 0, 0, 'rgb(255,255,255)');
                this.game.debug.body(this.player);
            }
        }

        preload() {
            // this.game.load.tilemap('world_tilemap', 'assets/world_tilemap.json', null, Phaser.Tilemap.TILED_JSON);
            // this.game.load.image('tileset_nature_1', 'assets/tileset_nature_1.png');
            this.game.load.tilemap('world2', 'assets/world2.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('ground', 'assets/ground.png');
            this.game.load.image('nature', 'assets/nature.png');
            this.game.load.image('nature2', 'assets/nature2.png');
            this.game.load.image('water', 'assets/water.png');
            this.game.load.image('collision', 'assets/collision.png');
            this.game.load.spritesheet('girl', 'assets/character_girl_5.png', 32, 32);
        }

        create() {
            // Load the tilemap world_tilemap.json, and the image asset(s) it needs 
            // this.map = this.game.add.tilemap('world_tilemap');
            // this.map.addTilesetImage('tileset_nature_1', 'tileset_nature_1');
            this.map = this.game.add.tilemap('world2');
            this.map.addTilesetImage('ground', 'ground');
            this.map.addTilesetImage('nature', 'nature');
            this.map.addTilesetImage('nature2', 'nature2');
            this.map.addTilesetImage('water', 'water');
            this.map.addTilesetImage('collision', 'collision');

            // Render the layers defined in the tilemap, and collect them into an object for ease of use.
            this.mapLayers = {}
            this.mapLayers.bg = this.map.createLayer('bg');
            this.mapLayers.cliffs = this.map.createLayer('cliffs');
            this.mapLayers.cliffs2 = this.map.createLayer('cliffs2');
            this.mapLayers.bottom = this.map.createLayer('bottom');
            this.mapLayers.top = this.map.createLayer('top');
            this.mapLayers.collision = this.map.createLayer('collision');

            // set blockedLayer as invisible collision layer
            this.map.setCollisionBetween(1, 20000, true, 'collision');
            // this.mapLayers.collision.alpha = 0;
            this.mapLayers.bg.resizeWorld(); // set world boundaries to map size

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
}