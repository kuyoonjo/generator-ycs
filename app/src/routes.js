'use strict'

import path from 'path'
import fs from 'fs'
import config from './config'

export default function (app) {
  const apiDir = path.join(config.root, 'src/api')
  fs.readdir(apiDir, (error, dirs) => {
    if (error) return console.error(error)
    dirs.forEach(dir => {
      if (/^\./.test(dir)) return
      fs.stat(`${apiDir}/${dir}/index.js`, (error, stat) => {
        if (error) return
        if (stat.isFile()) {
          let route = require(`./api/${dir}`)
          app.use(route.URI, route.default)
        }
      })
    })
  })

  app.use('/api/auth', require('./auth').default)
}
