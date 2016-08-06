var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/', function (request, response) {
    response.redirect('default.html');
});

var usernames = {};

io.sockets.on('connection', function (socket) {
    console.log('Connection made');

    socket.on('sendchat', function (data) {
        console.log('Chat message received and sent out');
        io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('adduser', function (username) {
        console.log('Adding user: ' + username);
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'SERVER', 'you have connected');
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        io.sockets.emit('updateusers', usernames);
    });

    socket.on('disconnect', function () {
        console.log(socket.username + ' disconnected');
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });
});

var port = 8080;
server.listen(port);
console.log('Listening on port: ' + port);

