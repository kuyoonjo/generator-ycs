/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     <%= endpoint %>              ->  index
 * POST    <%= endpoint %>              ->  create
 * GET     <%= endpoint %>/:id          ->  show
 * PUT     <%= endpoint %>/:id          ->  update
 * PATCH   <%= endpoint %>/:id          ->  updatePartial
 * DELETE  <%= endpoint %>/:id          ->  destroy
 */

'use strict'

import _ from 'lodash'
import <%= className %> from './model'
import * as Utils from '../../components/utils'
import config from '../../config'

// Gets a list of <%= classNamePlural %>
export function index(req, res) {
  return Utils.paginate(<%= className %>, req)
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Gets a single <%= className %> from the DB
export function show(req, res) {
  return <%= className %>.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Creates a new <%= className %> in the DB
export function create(req, res) {
  return Utils.createEntity(<%= className %>, req)
    .then(Utils.saveEntity())
    .then(Utils.respondWithResult(res, 201))
    .catch(Utils.handleError(res));
}

// Updates an existing <%= className %> in the DB
export function update(req, res) {
  return <%= className %>.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.putUpdates(req.body))
    .then(Utils.saveEntity())
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Updates an existing <%= className %> partially in the DB
export function updatePartial(req, res) {
  return <%= className %>.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.patchUpdates(req.body))
    .then(Utils.saveEntity())
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Deletes a <%= className %> from the DB
export function destroy(req, res) {
  return <%= className %>.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.removeEntity(res))
    .catch(Utils.handleError(res));
}
