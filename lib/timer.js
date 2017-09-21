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
        return callback(err)
      }
      callback(null, result)
      this.emit('token', {
        appName: this.appName,
        appId: this.appId,
        ...result
      })
      if (this.tokenTimer) {
        clearTimeout(this.tokenTimer)
      }
      this.tokenTimer = setTimeout(super.getToken.bind(this), this.token.expiresIn * 1000 - 10000)
    })
  }
  getTicket(callback) {
    super.getTicket((err, result) => {
      if (err) {
        return callback(err)
      }
      callback(null, result)
      this.emit('ticket', {
        appName: this.appName,
        appId: this.appId,
        ...result
      })
      if (this.ticketTimer) {
        clearTimeout(this.ticketTimer)
      }
      this.ticketTimer = setTimeout(super.getTicket.bind(this), this.ticket.expiresIn * 1000 - 10000)
    })
  }
  start() {
    this.getToken()
    this.getTicket()
  }
}

module.exports = TimerToken