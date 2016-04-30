"use strict";
var compression = require('compression')
let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server, {});
let _ = require('lodash');
app.use(compression());
app.use('/', express.static(__dirname + '/public'));

let SOCKET_LIST = {};
let PLAYER_LIST = {};
let UPDATED_PLAYERS = {};

let Player = (id) => {
    return {
        id: id,
        playerName: 'Player_' + Math.floor(1 + Math.random() * 100000),
        posX: 180,
        posY: 300,
        animation: 'walkDown',
        animationPlaying: false
    }
}

io.sockets.on('connection', (socket) => {
    SOCKET_LIST[socket.id] = socket;
    PLAYER_LIST[socket.id] = Player(socket.id);

    socket.emit('playerJoined', { id: socket.id, players: PLAYER_LIST });
    socket.broadcast.emit('otherPlayerJoined', PLAYER_LIST[socket.id]);

    socket.on('commandToServer', (command) => {
        let response;
        switch (command) {
            case '/player_count':
                response = Object.keys(PLAYER_LIST).length;
                break;
            case '/player_list':
                response = Object.keys(PLAYER_LIST).join(', ');
                break;
            case '/kick_all':
                for (let socketid in SOCKET_LIST) {
                    if (socketid !== socket.id) {
                        SOCKET_LIST[socketid].disconnect();
                        delete SOCKET_LIST[socketid];
                        delete PLAYER_LIST[socketid];
                    }
                }
                response = 'All other players have been kicked.';
                break;
            default:
                response = 'Command not found.';
        }
        socket.emit('commandResponse', response);
    });

    socket.on('changeNick', (nick) => {
        let existingNick = _.find(PLAYER_LIST, p => p.playerName === nick);
        if (existingNick) {
            let alreadyTaken = { type: 'system', text: 'Nickname ' + nick + ' is already taken.' };
            socket.emit('chatMessageToClients', alreadyTaken);
        }
        else {
            let oldNick = PLAYER_LIST[socket.id].playerName;
            PLAYER_LIST[socket.id].playerName = nick;
            let announcement = { type: 'system', text: oldNick + ' is now known as ' + nick };
            io.sockets.emit('chatMessageToClients', announcement);
        }
    });

    socket.on('chatMessageToServer', (message) => {
        let chatMessage = { playerName: PLAYER_LIST[socket.id].playerName, text: message };
        io.sockets.emit('chatMessageToClients', chatMessage);
    });

    socket.on('updatePlayerData', (playerData) => {
        // Update player data in server state
        PLAYER_LIST[playerData.id] = playerData;
        UPDATED_PLAYERS[playerData.id] = playerData;
    });


    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
        io.sockets.emit('otherPlayerLeft', socket.id);
    });
});

setInterval(() => {
    if (Object.keys(UPDATED_PLAYERS).length > 0) {
        io.sockets.emit('updatePlayerPositions', UPDATED_PLAYERS);
        UPDATED_PLAYERS = {};
    }
}, 1000 / 60);

const port = process.env.NODE_ENV === 'production' ? 80 : 8080;
server.listen(port);
console.info("Server started on port " + port);