'use strict'

import mongoose from 'mongoose'
import paginate from 'mongoose-paginate'
import crate from 'mongoose-crate'
import LocalFS from 'mongoose-crate-localfs'
import GraphicsMagic from 'mongoose-crate-gm'
import config from '../../config'

export default mongoose.model('Sample',
  new mongoose.Schema({
    name: String,
    info: String,
    active: Boolean
  })
    .plugin(paginate)
)
