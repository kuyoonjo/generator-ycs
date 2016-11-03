'use strict'

import _ from 'lodash'
import passport from 'passport'
import config from '../config'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import compose from 'composable-middleware'
import Auth from '../api/user/model'
import * as Utils from '../components/utils'
import {EntityNotFoundError, PermissonError, getErrorStatusCode} from '../components/errors'

const validateJwt = expressJwt({
  secret: config.secrets.session
})

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 4xx
 */
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use((req, res, next) => {
      // allow access_token to be passed through query parameter as well
      // if (req.query && req.query.hasOwnProperty('access_token')) {
      //   req.headers.authorization = 'Bearer ' + req.query.access_token
      // }
      validateJwt(req, res, next)
    })
    // Attach user to request
    .use((error, req, res, next) => {
      if (error) {
        return Utils.respondError(res, error)
      }
      Auth.findById(req.user._id).exec()
        .then(user => {
          if (!user) {
            let error = new EntityNotFoundError('Invalid user id')
            return Utils.respondError(res, error)
          }
          req.user = user
          next()
        })
        .catch(error => next(error))
    })
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set')
  }

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      if (!!~req.user.roles.indexOf(roleRequired) || !!~req.user.roles.indexOf('super')) {
        next()
      } else {
        let error = new PermissonError('you do not have sufficient privilege to perform this action')
        Utils.respondError(res, error)
      }
    })
}

/*
 * Checks if the user role meets the minimum requirements of the route or matches req.params.id
 */
export function OwnsOrHasRole(roleRequired, model, field) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set')
  }

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      new Promise((resolve, reject) => {
        let error = new PermissonError('you do not have sufficient privilege to perform this action')
        if (!!~req.user.roles.indexOf(roleRequired) || !!~req.user.roles.indexOf('super'))
          return resolve(false)
        if (req.user._id == req.params.id)
          return resolve(true)
        if (!model || !user) return reject(error)
        model.findById(req.params.id, field).exec()
          .then(Utils.handleEntityNotFound(res))
          .then(entiry => {
            if (entiry[field]._id == req.user._id)
              return resolve(true);
            return reject(error);
          })
          .catch(error => reject(error));
      })
        .then(owned => {
          if(owned) {
            req.owned = true;
          }
          next()
        })
        .catch(error => Utils.respondError(res, error))
    })
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, roles) {
  return jwt.sign({ _id: id, roles: roles }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  })
}

/**
 * Set token cookie directly for oAuth strategies
 */
// export function setTokenCookie(req, res) {
//   if (!req.user) {
//     return res.status(404).send('It looks like you aren\'t logged in, please try again.')
//   }
//   var token = signToken(req.user._id, req.user.role)
//   res.cookie('token', token)
//   res.redirect('/auth/token/' + token)
// }

/**
 * If there is a user, appends it to the req
 * else req.user would be undefined
 */
export function appendUser() {
  return compose()
    // Attach user to request
    .use((req, res, next) => {
      validateJwt(req, res, val => {
        if (_.isUndefined(val)) {
          Auth.findById(req.user._id, (err, user) => {
            if (err) {
              return next(err)
            } else if (!user) {
              req.user = undefined
              return next()
            } else {
              req.user = user
              next()
            }
          })
        } else {
          req.user = undefined
          next()
        }
      })
    })
}
