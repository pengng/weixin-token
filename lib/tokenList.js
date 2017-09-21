const EventEmitter = require('events')
const TimerToken = require('./timer')

class TokenList extends EventEmitter {
  constructor(options) {
    super()
    this.init(options)
  }
  init(options) {
    this.list = options.map(item => {
      const { appName, appId, appSecret } = item
      const timer = new TimerToken(appName, appId, appSecret)
      timer.on('token', this.emit.bind(this, 'token')).on('ticket', this.emit.bind(this, 'ticket'))
    })
  }
  getToken(appName) {
    const token = this.list.filter(item => {
      return item.appName === appName
    })
    return token.length > 0 ? token[0].token.str : ''
  }
  getTicket(appName) {
    const token = this.list.filter(item => {
      return item.appName === appName
    })
    return token.length > 0 ? token[0].ticket.str : ''
  }
  getJsConfig(appName, url, callback) {
    const token = this.list.filter(item => {
      return item.appName === appName
    })
    if (token.length === 0) {
      return callback(null)
    }
    token[0].getJsConfig(url, callback)
  }
}

module.exports = TokenList