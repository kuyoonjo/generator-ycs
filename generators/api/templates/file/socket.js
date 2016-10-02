'use strict'

import EventEmitter from './events'

// Model events to emit
const events = ['save', 'remove']

export function register(socket) {
  // Bind model events to socket events
  for(let event of events) {
    let listener = createListener('<%= apiName %>:' + event, socket)

    EventEmitter.on(event, listener)
    socket.on('disconnect', removeListener(event, listener))
  }
}


function createListener(event, socket) {
  return doc => socket.emit(event, doc)
}

function removeListener(event, listener) {
  return () => EventEmitter.removeListener(event, listener)
}
