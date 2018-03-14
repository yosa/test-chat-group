var fs = require('fs');
var app = require('express')();

if (process.env.NODE_ENV !== 'production') {
  var server = require('http').Server(app);
} else {
  var server = require('https').createServer({
    key: fs.readFileSync(__dirname + '/privkey.pem'),
    cert: fs.readFileSync(__dirname + '/fullchain.pem')
  });
}

console.log(process.env.NODE_ENV)

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('message', function(message) {
    console.log('message', message)
    socket.broadcast.emit('message', message);
  });
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});