namespace PhaserGame {
    export interface IChatMessage {
        playerName: string;
        text: string;
    }
    export interface IPlayerData {
        id: number;
        posX: number;
        posY: number;
        velX: number;
        velY: number;
        animation: string;
        animationPlaying: boolean;
    }
}