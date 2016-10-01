import express from 'express'
import path from 'path'
import config from '../config'

export default function (app) {
    const docsPath = path.join(config.root, 'swagger-ui')
    app.use('/api-docs', express.static(docsPath))

    if (app.get('env') === 'development') {
        const tmpDocsPath = path.join(config.root, 'tmp', 'swagger-ui')
        app.use('/api-docs', express.static(tmpDocsPath))
    }
}