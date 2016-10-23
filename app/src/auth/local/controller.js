import passport from 'passport'
import {signToken} from '../service'
import Auth from '../../api/user/model'
import * as Utils from '../../components/utils'
import config from '../../config'
import {EntityNotFoundError, ValidationError, getErrorStatusCode} from '../../components/errors'

export function signIn(req, res, next) {
  passport.authenticate('local', (error, user) => {
    if (!user) {
      error = error || new EntityNotFoundError('Something went wrong, please try again.')
    }
    if (error) {
      return Utils.respondError(res, error)
    }

    const token = signToken(user._id, user.roles)
    res.json({ token })
  })(req, res, next)
}

export function signUp(req, res) {
  let newUser = new Auth(req.body)
  newUser.roles = config.auth.roles.default
  newUser.save()
    .then(user => {
      const token = signToken(user._id, user.roles)
      return { token }
    })
    .then(Utils.respondWithResult(res, 201))
    .catch(Utils.handleError(res))
}

export function reset(req, res) {
  const oldPass = String(req.body.oldPassword)
  const newPass = String(req.body.newPassword)

  return Auth.findById(req.user._id).exec()
    .then(Utils.handleEntityNotFound(res))
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass
        return user.save()
          .then(Utils.respond(res, 205))
          .catch(Utils.handleError(res))
      } else {
        throw new ValidationError('Incorrect password')
      }
    })
    .catch(Utils.handleError(res))
}
