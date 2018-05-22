const fs = require('fs');
const express = require('express');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://test-firebase-ae147.firebaseio.com'
});

const db = admin.firestore();
const chatEvents = db.collection('yetcargo.events');
const chatMessages = db.collection('yetcargo.messages');

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
    chatMessages.add(message)
  });
  socket.on('user.connected', function(user) {
    console.log('user connected', user)
    socket.broadcast.emit('user.connected', user);
    chatEvents.add({
      type: 'user.connected',
      data: user
    });
  })
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});