const fs = require('fs');
const app = require('express')();

if (process.env.NODE_ENV !== 'production') {
  var server = require('http').Server(app);
} else {
  var server = require('https').createServer({
    key: fs.readFileSync(__dirname + '/privkey.pem'),
    cert: fs.readFileSync(__dirname + '/fullchain.pem')
  });
}

const io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('socket connected');

  socket.on('message', function(message) {
    console.log('message', message)
    socket.broadcast.emit('message', message);
  });
  socket.on('user.connected', function(user) {
    console.log('user connected', user)
    socket.broadcast.emit('user.connected', user)
  })
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});