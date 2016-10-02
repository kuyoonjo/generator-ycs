'use strict'

import mongoose from 'mongoose'
import extend from 'mongoose-schema-extend'
import Auth from '../../auth/model'

export default mongoose.model('User',
  Auth.schema.extend({
    name: String,
    info: String,
    active: Boolean
  })
)