namespace PhaserGame {
    export interface IChatMessage {
        playerName: string;
        text: string;
    }
    export interface IPlayerPositionUpdateMessage {
        posX: number;
        posY: number;
        velX: number;
        velY: number;
        animation: string;
        timestamp: Date;
    }
}