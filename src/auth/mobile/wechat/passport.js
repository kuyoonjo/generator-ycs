import passport from 'passport'
import CustomStrategy from 'passport-custom'
import * as controller from './controller'
import Auth from '../../model'

export function setup() {
  passport.use('wechat', new CustomStrategy(
    function (req, done) {
      if (req.body.access_token && req.body.openid) {
        return auth(req, done)
      }
      return done({ message: 'access_token and openid are required' })
    }))
}

function auth(req, done) {
  controller.verify(req)
    .then(me => {
      Auth.findOne({
        'providers': {
          $elemMatch: {
            'name': 'wechat',
            'openid': me.openid
          }
        }
      }).exec()
        .then(user => {
          if (user) {
            return done(null, user)
          }

          controller.signUp(me)
            .then(user => done(null, user))
            .catch(error => done(error))
        })
        .catch(error => done(error))
    })
    .catch(error => done(error))
}