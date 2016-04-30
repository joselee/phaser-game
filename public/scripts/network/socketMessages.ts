namespace PhaserGame {
    export interface IChatMessage {
        type?: string;
        playerName?: string;
        text: string;
    }
    export interface IPlayerData {
        id: string;
        playerName: string;
        posX: number;
        posY: number;
        animation: string;
        animationPlaying: boolean;
    }
}