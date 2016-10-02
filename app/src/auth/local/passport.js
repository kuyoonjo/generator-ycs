import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import {AuthError} from '../../components/errors'

function localAuthenticate(Auth, username, password, done) {
  Auth.findOne({
    username: username
  }).exec()
    .then(user => {
      if (!user) {
        return done(new AuthError('This username is not registered'))
      }
      user.authenticate(password, (error, authenticated) => {
        if (error) {
          return done(error)
        }
        if (!authenticated) {
          return done(new AuthError('This password is not correct'))
        } else {
          return done(null, user)
        }
      })
    })
    .catch(error => done(error))
}

export function setup(Auth) {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password' // this is the virtual field on the model
  }, function(username, password, done) {
    return localAuthenticate(Auth, username, password, done)
  }))
}
