'use strict'

import {Router} from 'express'
import config from '../../config'
import * as auth from '../../auth/service'
import * as controller from './controller'

const router = new Router()
export const URI = 'samples'

router.get(
  '/',
  auth.appendUser(),
  controller.index
)

router.get(
  '/:id',
  auth.appendUser(),
  controller.show
)

router.post(
  '/',
  auth.appendUser(),
  controller.create
)

router.put(
  '/:id',
  auth.appendUser(),
  controller.update
)

router.patch(
  '/:id',
  auth.appendUser(),
  controller.updatePartial
)

router.delete(
  '/:id',
  auth.appendUser(),
  controller.destroy
)

export default router
