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
            timer
                .on('token', this.emit.bind(this, 'token'))
                .on('ticket', this.emit.bind(this, 'ticket'))
                .on('error', this.emit.bind(this, 'error'))
            return timer
        })
    }
    getToken(appName) {
        const client = this.getClient(appName)
        return client && client.token.str
    }
    refreshToken(appName, callback) {
        const client = this.getClient(appName)
        client ? client.getToken(callback) : callback(null, false)
    }
    getTicket(appName) {
        const client = this.getClient(appName)
        return client && client.ticket.str
    }
    refreshTicket(appName, callback) {
        const client = this.getClient(appName)
        client ? client.getTicket(callback) : callback(null, false)
    }
    getJsConfig(appName, url) {
        const client = this.getClient(appName)
        return client && client.getJsConfig(client.ticket.str, url)
    }
    getClient(appName) {
        const clients = this.list.filter(item => {
            return item.appName === appName
        })
        return clients.length > 0 && clients[0]
    }
    start() {
        this.list.forEach(item => item.start())
    }
}

module.exports = TokenList