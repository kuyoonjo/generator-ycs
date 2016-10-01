'use strict'

import {Router} from 'express'
import Auth from './model'

// Passport Configuration
require('./local/passport').setup(Auth)
require('./mobile/wechat/passport').setup(Auth)
// require('./google/passport').setup(User, config)
// require('./twitter/passport').setup(User, config)
// require('./qq/passport').setup(User, config)

const router = new Router()

router.use('/local', require('./local').default)
router.use('/mobile/wechat', require('./mobile/wechat').default)
// router.use('/twitter', require('./twitter').default)
// router.use('/google', require('./google').default)
// router.use('/qq', require('./qq').default)

// router.use('/token', require('./token').default)

export default router
