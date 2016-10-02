'use strict'

import express from 'express'
const router = express.Router()
import {isAuthenticated} from '../service'
import * as controller from './controller'

router.post('/', controller.signIn)
router.post('/signup', controller.signUp)
router.post('/reset', isAuthenticated(), controller.reset)

export default router
