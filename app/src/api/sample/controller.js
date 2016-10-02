/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/xxxxxx              ->  index
 * POST    /api/xxxxxx              ->  create
 * GET     /api/xxxxxx/:id          ->  show
 * PUT     /api/xxxxxx/:id          ->  update
 * PATCH   /api/xxxxxx/:id          ->  updatePartial
 * DELETE  /api/xxxxxx/:id          ->  destroy
 */

'use strict'

import _ from 'lodash'
import Model from './model'
import * as Utils from '../../components/utils'
import config from '../../config'

// Gets a list of Models
export function index(req, res) {
  return Utils.paginate(Model, req)
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Gets a single Model from the DB
export function show(req, res) {
  return Model.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Creates a new Model in the DB
export function create(req, res) {
  return Utils.createEntity(Model, req)
    .then(Utils.saveEntity())
    .then(Utils.respondWithResult(res, 201))
    .catch(Utils.handleError(res));
}

// Updates an existing Model in the DB
export function update(req, res) {
  return Model.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.putUpdates(req.body))
    .then(Utils.saveEntity())
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Updates an existing Model partially in the DB
export function updatePartial(req, res) {
  return Model.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.patchUpdates(req.body))
    .then(Utils.saveEntity())
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Deletes a Model from the DB
export function destroy(req, res) {
  return Model.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.removeEntity(res))
    .catch(Utils.handleError(res));
}
