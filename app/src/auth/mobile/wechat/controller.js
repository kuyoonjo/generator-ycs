import request from 'request'
import passport from 'passport'
import {signToken} from '../../service'
import Auth from '../../model'
import * as Utils from '../../../components/utils'
import config from '../../../config'

export function signIn(req, res, next) {
  passport.authenticate('wechat', (err, user, info) => {
    const error = err || info
    if (error) {
      return res.status(401).json(error)
    }
    if (!user) {
      return res.status(404).json({ message: 'Something went wrong, please try again.' })
    }

    const token = signToken(user._id, user.roles)
    res.json({ token })
  })(req, res, next)
}

export function signUp(me) {
  let user = new Auth({
    roles: config.auth.roles.default,
    providers: [{
      name: 'wechat',
      openid: me.openid
    }]
  })
  return user.save()
}

export function getUserInfo(req) {
  const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${req.body.access_token}&openid=${req.body.openid}`
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (error) return reject(error)
      let json = JSON.parse(body)
      if (json.errcode) return reject(json)
      resolve(json)
    })
  })
}

export function verify(req) {
  const url = `https://api.weixin.qq.com/sns/auth?access_token=${req.body.access_token}&openid=${req.body.openid}`
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (error) return reject(error)
      let json = JSON.parse(body)
      if (json.errcode) return reject(json)
      resolve(json)
    })
  })
}