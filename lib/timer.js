const Token = require('./token')

class TimerToken extends Token {
  constructor() {
    super(...arguments)
    this.tokenTimer = null
    this.ticketTimer = null
  }
  getToken(callback) {
    super.getToken((err, result) => {
      if (err) {
        return callback && callback(err)
      }
      callback && callback(null, result)
      this.emit('token', Object.assign({
        appName: this.appName,
        appId: this.appId
      }, result))
      if (this.tokenTimer) {
        clearTimeout(this.tokenTimer)
      }
      this.tokenTimer = setTimeout(this.getToken.bind(this), this.token.expiresIn * 1000 - 30000)
    })
  }
  getTicket(callback) {
    super.getTicket(this.token.str, (err, result) => {
      if (err) {
        return callback && callback(err)
      }
      callback && callback(null, result)
      this.emit('ticket', Object.assign({
        appName: this.appName,
        appId: this.appId
      }, result))
      if (this.ticketTimer) {
        clearTimeout(this.ticketTimer)
      }
      this.ticketTimer = setTimeout(this.getTicket.bind(this, this.token.str), this.ticket.expiresIn * 1000 - 30000)
    })
  }
  start() {
    this.getToken(err => {
      if (err) {
        return this.emit('error', err)
      }
      this.getTicket()
    })
  }
}

module.exports = TimerToken