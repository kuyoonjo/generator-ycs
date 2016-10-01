'use strict';

import path from 'path'

const routes = [
  // Inject routes start
  require('./api/sample'),
  require('./api/fileSample'),
  require('./api/imageSample'),
  require('./api/user'),
  // Inject routes end
]

export default function(app) {
  routes.forEach(route => {
    app.use(`/api/${route.URI}`, route.default)
  })

  app.use('/api/auth', require('./auth').default)
}
