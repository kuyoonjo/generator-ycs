/**
 * Socket.io configuration
 */
'use strict'

import path from 'path'
import fs from 'fs'
import config from './'

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2))
  })

  // Insert sockets below
  const apiDir = path.join(config.root, 'src/api')
  fs.readdir(apiDir, (error, dirs) => {
    if (error) return console.error(error)
    dirs.forEach(dir => {
      if (/^\./.test(dir)) return
      fs.stat(`${apiDir}/${dir}/socket.js`, (error, stat) => {
        if (error) return
        if (stat.isFile()) {
          let route = require(`../api/${dir}/socket`)
          route.register(socket)
        }
      })
    })
  })
  //require('../api/thing/thing.socket').register(socket)
}

export default function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }))

  socketio.on('connection', socket => {
    socket.address = socket.request.connection.remoteAddress +
      ':' + socket.request.connection.remotePort

    socket.connectedAt = new Date()

    socket.log = (...data) => {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data)
    }

    // Call onDisconnect.
    socket.on('disconnect', () => {
      onDisconnect(socket)
      socket.log('DISCONNECTED')
    })

    // Call onConnect.
    onConnect(socket)
    socket.log('CONNECTED')
  })
}
