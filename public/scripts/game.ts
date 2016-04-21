namespace App {
    export class SimpleGame {
        game: Phaser.Game;
        
        constructor() {
            this.game = new Phaser.Game(1024, 2048, Phaser.AUTO, 'game', { preload: this.preload, create: this.create });
        }

        preload() {
            // this.game.load.image('chars1', '../assets/character_sheet1.png');
        }
        create() {
            // var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            // logo.anchor.setTo(0.5, 0.5);
        }
    }
}