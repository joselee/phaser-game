"use strict";
let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server, {});
app.use('/', express.static(__dirname + '/public'));

let SOCKET_LIST = {};
let PLAYER_LIST = {};
let UPDATED_PLAYERS = {};

let Player = (id) => {
    return {
        id: id,
        posX: 180,
        posY: 300,
        velX: 0,
        velY: 0,
        animation: 'walkDown',
        animationPlaying: false
    }
}

io.sockets.on('connection',  (socket) => {
    SOCKET_LIST[socket.id] = socket;
    PLAYER_LIST[socket.id] = Player(socket.id);

    socket.emit('playerJoined', {id: socket.id, players: PLAYER_LIST});
    socket.broadcast.emit('otherPlayerJoined', PLAYER_LIST[socket.id]);

    socket.on('chatMessageToServer', (message) => {
        io.sockets.emit('chatMessageToClients', message);
    });

    socket.on('playerPositionToServer', (playerData) => {
        // Update player position in server state
        PLAYER_LIST[playerData.id] = playerData;
        UPDATED_PLAYERS[playerData.id] = playerData;
    });


    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
});

setInterval(() => {
    if(Object.keys(UPDATED_PLAYERS).length > 0){
        io.sockets.emit('updatePlayerPositions', UPDATED_PLAYERS);
        UPDATED_PLAYERS = {};
    }
}, 1000/60);

server.listen(8080);
console.log("Server started on port 8080");