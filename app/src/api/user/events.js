'use strict'

import _ from 'lodash'
import {EventEmitter} from 'events'
import Model from './model'

const eventEmitter = new EventEmitter()

// Set max event listeners (0 == unlimited)
eventEmitter.setMaxListeners(0)

// Model events
const events = {
  'save': 'save',
  'remove': 'remove'
}

// Register the event emitter to the model events
_.forEach(events, (v, k) => Model.schema.post(k, emitEvent(v)))

function emitEvent(event) {
  return doc => {
    eventEmitter.emit(event + ':' + doc._id, doc)
    eventEmitter.emit(event, doc)
  }
}

export default eventEmitter