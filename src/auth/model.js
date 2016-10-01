'use strict'

import crypto from 'crypto'
import mongoose from 'mongoose'
mongoose.Promise = require('bluebird')
import {Schema} from 'mongoose'
import config from '../config'

const authTypes = Object.keys(config.auth.providers)

const AuthSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: function () {
      if (!this.providers || !this.providers.length) {
        return true
      } else {
        return false
      }
    }
  },
  password: {
    type: String,
    required: function () {
      if (!this.providers || !this.providers.length) {
        return true
      } else {
        return false
      }
    }
  },
  roles: [{
    type: String
  }],
  datetime: {
    type: Date,
    default: Date.now
  },
  providers: [{
    name: {
      type: String,
      enum: authTypes
    },
    openid: String
  }],
  salt: String
}, { 
  collection : 'auths', 
  discriminatorKey : '_model' 
})

/**
 * Validations
 */

// Validate empty username
AuthSchema
  .path('username')
  .validate(function (username) {
    if (this.providers && this.providers.length) {
      return true
    }
    return username.length
  }, 'Username cannot be blank')

// Validate empty password
AuthSchema
  .path('password')
  .validate(function (password) {
    if (this.providers && this.providers.length) {
      return true
    }
    return password.length
  }, 'Password cannot be blank')

// Validate username is not taken
AuthSchema
  .path('username')
  .validate(function (value, respond) {
    var self = this
    if (this.providers && this.providers.length) {
      return respond(true)
    }
    return this.constructor.findOne({ username: value }).exec()
      .then(function (user) {
        if (user) {
          if (self.id === user.id) {
            return respond(true)
          }
          return respond(false)
        }
        return respond(true)
      })
      .catch(function (err) {
        throw err
      })
  }, 'The specified username is already in use.')

/**
 * Pre-save hook
 */

function validatePresenceOf (value) {
  return value && value.length
}

AuthSchema
  .pre('save', function (next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next()
    }

    if (!validatePresenceOf(this.password)) {
      if (!this.providers || !this.providers.length) {
        return next(new Error('Invalid password'))
      } else {
        return next()
      }
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return next(saltErr)
      }
      this.salt = salt
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return next(encryptErr)
        }
        this.password = hashedPassword
        next()
      })
    })
  })

/**
 * Methods
 */
AuthSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password)
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err)
      }

      if (this.password === pwdGen) {
        callback(null, true)
      } else {
        callback(null, false)
      }
    })
  },

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    var defaultByteSize = 16

    if (typeof arguments[0] === 'function') {
      callback = arguments[0]
      byteSize = defaultByteSize
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1]
    }

    if (!byteSize) {
      byteSize = defaultByteSize
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString('base64')
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        callback(err)
      } else {
        callback(null, salt.toString('base64'))
      }
    })
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null
      } else {
        return callback('Missing password or salt')
      }
    }

    var defaultIterations = 10000
    var defaultKeyLength = 64
    var salt = new Buffer(this.salt, 'base64')

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
        .toString('base64')
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if (err) {
        callback(err)
      } else {
        callback(null, key.toString('base64'))
      }
    })
  }
}

export default mongoose.model('Auth', AuthSchema)