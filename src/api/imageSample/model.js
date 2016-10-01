'use strict'

import mongoose from 'mongoose'
import paginate from 'mongoose-paginate'
import crate from 'mongoose-crate'
import LocalFS from 'mongoose-crate-localfs'
import GraphicsMagic from 'mongoose-crate-gm'
import config from '../../config'

export default mongoose.model('SampleWithImage',
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
        image: {
          processor: new GraphicsMagic({
            //tmpDir: '/tmp', // Where transformed files are placed before storage, defaults to os.tmpdir()
            formats: ['JPEG', 'GIF', 'PNG'], // Supported formats, defaults to ['JPEG', 'GIF', 'PNG', 'TIFF']
            transforms: {
              original: {
                // keep the original size
                format: '.jpg'
              },
              medium: {
                resize: '250x250',
                format: '.jpg'
              },
              small: {
                resize: '150x150',
                format: '.jpg'
              },
              thumbnail: {
                resize: '50x50',
                format: '.jpg'
              }
            }
          })
        },
        images: {
          array: true,
          processor: new GraphicsMagic({
            //tmpDir: '/tmp', // Where transformed files are placed before storage, defaults to os.tmpdir()
            formats: ['JPEG', 'GIF', 'PNG'], // Supported formats, defaults to ['JPEG', 'GIF', 'PNG', 'TIFF']
            transforms: {
              original: {
                // keep the original size
                format: '.jpg'
              },
              medium: {
                resize: '250x250',
                format: '.jpg'
              },
              small: {
                resize: '150x150',
                format: '.jpg'
              },
              thumbnail: {
                resize: '50x50',
                format: '.jpg'
              }
            }
          })
        }
      }
    })
)
