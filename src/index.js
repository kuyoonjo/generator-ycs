'use strict'

import express from 'express'
import mongoose from 'mongoose'
mongoose.Promise = require('bluebird')
import config from './config'
import http from 'http'

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options)
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err)
  process.exit(-1)
})

// Setup server
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
})
require('./config/socketio').default(socketio)
require('./config/express').default(app)
require('./routes').default(app)
require('./docs').default(app)

// Start server
setImmediate(() => {
  server.listen(config.port, config.ip, () => {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'))
  })
})

// Expose app
// exports = module.exports = app
