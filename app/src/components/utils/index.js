'use strict'

import _ from 'lodash'
import {EntityNotFoundError, getErrorStatusCode} from '../errors'

//
// Creating an entity with data from req.body
//
export function createEntity(model, req) {
  let entity = new model()
  if (req.body._id) delete req.body._id
  entity = _.merge(entity, req.body)
  return Promise.resolve(entity)
}

//
// Saving the entity
//
export function saveEntity() {
  return function (entity) {
    return entity.save()
  }
}

//
// Attaching file to field
//
export function attachFile(req, field) {
  return function (entity) {
    if (!req.files || !req.files[field] || !req.files[field].length) {
      return Promise.resolve(entity)
    }
    return attachFileToField(entity, req.files[field][0], field)
  }
}

//
// Attaching files to field
//
export function attachFiles(req, field) {
  return function (entity) {
    if (!req.files || !req.files[field] || !req.files[field].length) {
      return Promise.resolve(entity)
    }
    return Promise.all(req.files[field].map(file => attachFileToField(entity, file, field)))
      .then(() => entity)
  }
}

//
// responding without body
//
export function respond(res, statusCode) {
  return function () {
    res.status(statusCode || 204).end()
  }
}

//
// responding with json body
//
export function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity)
    }
  }
}

//
// responding errors
//
export function respondError(res, error) {
  return res.status(getErrorStatusCode(error)).json({
    name: error.name,
    message: error.message
  })
}

//
// put updates
//
export function putUpdates(updates) {
  return function (entity) {
    const model = entity.constructor
    let template = new model()
    template._id = entity._id
    let updated = _.merge(template, updates)
    return entity.remove()
      .then(() => updated)
  }
}

//
// patch updates
//
export function patchUpdates(updates) {
  return function (entity) {
    if (updates._id) delete updates._id
    let updated = _.mergeWith(entity, updates, (objValue, srcValue) => {
      if (_.isObject(objValue) && srcValue === null) {
        if (_.isArray(objValue)) return []
        return {}
      }
      if (_.isArray(objValue)) {
        return _.compact(_.merge(objValue, srcValue))
      }
    })
    return Promise.resolve(updated)
  }
}

export function saveUpdates(updates) {
  return function (entity) {
    _.forOwn(updates, (v, k) => entity[k] = v)
    return entity.save()
      .then(updated => {
        return updated
      })
  }
}

export function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end()
        })
    }
  }
}

export function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      throw new EntityNotFoundError()
    }
    return entity
  }
}

export function handleError(res, statusCode) {
  return function (error) {
    console.log(error)
    if (error instanceof Error) {
      let json = {
        name: error.name,
        message: error.message
      }
      if (error.errors) json.errors = error.errors
      return res.status(getErrorStatusCode(error)).json(json)
    }
    statusCode = statusCode || 500
    res.status(statusCode).send(error)
  }
}

export function paginate(model, req, filters, options) {
  let _filters = {}
  let _options = {}

  if (filters) {
    _filters = _.merge(_filters, filters)
  }

  if (options) {
    _options = _.merge(_.options, options)
  }

  if (req.query._filters) {
    console.log(req.query._filters)
    try {
      let reqFilters = JSON.parse(req.query._filters)
      _filters = _.merge(_filters, reqFilters)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  if (req.query._options) {
    try {
      let reqOptions = JSON.parse(req.query._options)
      _options = _.merge(_options, reqOptions)
    } catch (error) {
      return Promise.reject({
        name: error.name,
        message: error.message
      })
    }
  }

  return model.paginate(_filters, _options)
}

//
// Non exported functions
//

function attachFileToField(entity, file, field) {
  return new Promise((resolve, reject) => {
    entity.attach(field, { path: file.path }, error => {
      if (error) return reject({
        name: error.name,
        message: error.message
      })
      return resolve(entity)
    })
  })
}