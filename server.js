var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {});

app.use('/', express.static(__dirname + '/public'));
server.listen(8080);
console.log("Server started on port 8080");

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var updatedPlayers = [];

var Player = function (id) {
    var self = {
        id: id,
        posX: 180,
        posY: 300,
        velX: 0,
        velY: 0,
        animation: 'walkDown',
        animationPlaying: false
    }
    self.updatePosition = function () {
        if (self.pressingRight)
            self.x += self.maxSpd;
        if (self.pressingLeft)
            self.x -= self.maxSpd;
        if (self.pressingUp)
            self.y -= self.maxSpd;
        if (self.pressingDown)
            self.y += self.maxSpd;
    }
    return self;
}

io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    PLAYER_LIST[socket.id] = Player(socket.id);

    // Send newly connected player their own info, and other's info
    socket.emit('playerJoined', {id: socket.id, players: PLAYER_LIST});

    // Notify everyone else that you joined
    socket.broadcast.emit('otherPlayerJoined', PLAYER_LIST[socket.id]);

    socket.on('chatMessageToServer', (message) => {
        io.sockets.emit('chatMessageToClients', message);
    });

    socket.on('playerPositionToServer', (message) => {
        // Update player position in server state
        console.log(message.posX);
        // io.sockets.emit('chatMessageToClients', message);
    });


    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

    // socket.on('keyPress', function (data) {
    //     if (data.inputId === 'left')
    //         player.pressingLeft = data.state;
    //     else if (data.inputId === 'right')
    //         player.pressingRight = data.state;
    //     else if (data.inputId === 'up')
    //         player.pressingUp = data.state;
    //     else if (data.inputId === 'down')
    //         player.pressingDown = data.state;
    // });
});

setInterval(function () {
    var pack = [];
    for (var i in PLAYER_LIST) {
        var player = PLAYER_LIST[i];
        player.updatePosition();
        pack.push({
            x: player.x,
            y: player.y,
            number: player.number
        });
    }
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions', pack);
    }
}, 1000/30);