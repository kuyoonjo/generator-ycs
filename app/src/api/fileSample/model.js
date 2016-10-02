'use strict'

import mongoose from 'mongoose'
import paginate from 'mongoose-paginate'
import crate from 'mongoose-crate'
import LocalFS from 'mongoose-crate-localfs'
import config from '../../config'

export default mongoose.model('FileSample',
  new mongoose.Schema({
    name: String,
    info: String,
    active: Boolean
  })
    .plugin(paginate)
    .plugin(crate, {
      storage: new LocalFS({
        directory: config.storage.local
      }),
      fields: {
        file: {},
        files: {
          array: true
        }
      }
    })
)
