const crypto = require('crypto')
const querystring = require('querystring')
const EventEmitter = require('events')
const request = require('request')
const WechatApiError = require('./error')

class Token extends EventEmitter {
  constructor(appName, appId, appSecret) {
    super()
    this.appName = appName
    this.appId = appId
    this.appSecret = appSecret
  }
  getToken(callback) {
    const url = 'https://api.weixin.qq.com/cgi-bin/token'
    const query = {
      grant_type: 'client_credential',
      appid: this.appId,
      secret: this.appSecret
    }
    const newUrl = url + '?' + querystring.stringify(query)
    this.preRequest({ url: newUrl }, (err, result) => {
      if (err) {
        return callback(err)
      }
      this.token = {
        str: result.access_token,
        expiresIn: result.expires_in
      }
      callback(null, result)
    })
  }
  getTicket(token, callback) {
    const url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
    const query = {
      access_token: token,
      type: 'jsapi'
    }
    const newUrl = url + '?' + querystring.stringify(query)
    this.preRequest({ url: newUrl }, (err, result) => {
      if (err) {
        return callback(err)
      }
      this.ticket = {
        str: result.ticket,
        expiresIn: result.expires_in
      }
      callback(null, result)
    })
  }
  getJsConfig(ticket, url) {
    const query = {
      noncestr: this.getNonceStr(),
      timestamp: this.getTimestamp(),
      url: this.formatUrl(url),
      jsapi_ticket: ticket
    }
    query.signature = this.getSignature(query)
    query.appId = this.appId
    query.nonceStr = query.noncestr
    delete query.noncestr
    return query
  }
  getNonceStr() {
    return Math.random().toString(36).slice(2, 18).split('').map(item => {
      return Math.random() > 0.5 ? item.toUpperCase() : item
    }).join('')
  }
  getTimestamp() {
    return parseInt(Date.now() / 1000).toString()
  }
  formatUrl(url) {
    return url.split('#')[0]
  }
  getSignature(query) {
    const arr = []
    for (let key in query) {
      arr.push(key + '=' + query[key])
    }
    const preStr = arr.sort().join('&')
    return crypto.createHash('sha1').update(preStr).digest('hex')
  }
  preRequest(options, callback) {
    return request(options, function (err, response, body) {
      if (err) {
        return callback(err)
      }
      try {
        body = JSON.parse(body)
      } catch(err) {
        return callback(err)
      }
      if (body.errcode) {
        return callback(new WechatApiError(body.errmsg, body.errcode))
      }
      callback(null, body)
    })
  }
}

module.exports = Token