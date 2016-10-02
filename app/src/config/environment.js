'use strict'

import path from 'path'
import multer from 'multer'
import os from 'os'

const root = path.normalize(__dirname + '/../..')

export default {
  env: process.env.NODE_ENV,

  // Root path of server
  root: root,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: '<%= appName %>-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    },
    uri:  process.env.MONGODB_URI ||
          process.env.MONGOHQ_URL ||
          process.env.OPENSHIFT_MONGODB_DB_URL +
          process.env.OPENSHIFT_APP_NAME ||
          'mongodb://localhost/<%= appName %>'
  },

  // Storages
  storage: {
    multer: multer({ dest: os.tmpdir() }),
    local: `${root}/localStorage`
  },

  // Oauth2 providers
  auth: {
    providers: {
      wechat: {
        appId: 'xxxxxx',
        appKey: 'xxxxxx'
      },
      qq: {
        appId: 'xxxxxx',
        appKey: 'xxxxxx'
      }
    }
  }
}
