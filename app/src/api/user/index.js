'use strict'

import {Router} from 'express'
import * as controller from './controller'
import * as auth from '../../auth/service'

const router = new Router()
export const URI = '/api/users'

router.get(
    '/',
    auth.hasRole('super'),
    controller.index
)

router.get(
    '/:id',
    auth.hasRole('super'),
    controller.show
)

router.post(
    '/',
    auth.hasRole('super'),
    controller.create
)

router.put(
    '/:id',
    auth.hasRole('super'),
    controller.update
)

router.patch(
    '/:id',
    auth.hasRole('super'),
    controller.updatePartial
)

router.delete(
    '/:id',
    auth.hasRole('super'),
    controller.destroy
)

export default router
