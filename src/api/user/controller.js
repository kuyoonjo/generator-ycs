/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  update
 * PATCH   /api/users/:id          ->  updatePartial
 * DELETE  /api/users/:id          ->  destroy
 */

'use strict'

import _ from 'lodash'
import User from './model'
import * as Utils from '../../components/utils'

// Gets a list of users
export function index(req, res) {
  return User.find().exec()
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Gets a single User from the DB
export function show(req, res) {
  return User.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Creates a new User in the DB
export function create(req, res) {
  return Utils.createEntity(User, req)
    .then(Utils.respondWithResult(res, 201))
    .catch(Utils.handleError(res));
}

// Updates an existing User in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return User.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.putUpdates(req.body))
    .then(Utils.saveEntity())
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Updates an existing User Partially in the DB
export function updatePartial(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return User.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.patchUpdates(req.body))
    .then(Utils.saveEntity())
    .then(Utils.respondWithResult(res))
    .catch(Utils.handleError(res));
}

// Deletes a User from the DB
export function destroy(req, res) {
  return User.findById(req.params.id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(Utils.removeEntity(res))
    .catch(Utils.handleError(res));
}
