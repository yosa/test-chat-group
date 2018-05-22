const express = require('express');
const app = express()
const fs = require('fs')
//const server = require('http').Server(app)
const server = require('https').createServer({
  key: fs.readFileSync(__dirname + '/privkey.pem'),
  cert: fs.readFileSync(__dirname + '/fullchain.pem')
}, app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = {
  db: {
    uri: 'mongodb://localhost/gpstracking'
  }
}

app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/ping', function(req, res) {
  res.status(200).send({
    pong: true
  })
})

io.on('connection', function(socket) {
  console.log('Alguien se ha conectado con Sockets', socket.id)
})

server.listen(8044 , () => {
  console.log("Servidor corriendo en http://localhost:8044")

  mongoose.Promise = global.Promise
  mongoose.connect(config.db.uri)
  const db = mongoose.connection

  db.on('error', (err) => {
    if (err.message.code === 'ETIMEDOUT') {
      console.log('error connect db mongo', err)
    }
  })

  db.once('open', () => {
    require('./routes/Locations')(app, io)
  })
})
