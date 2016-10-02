import {Router} from 'express'
import * as controller from './controller'

const router = new Router()

router.post('/', controller.signIn)

export default router