const TokenList = require('./tokenList')
const app = require('express').Router()

module.exports = options => {
  const tokenList = new TokenList(options.list)
  const trustIp = [/^::1$/, /127\.0\.0\.1$/]
  if (options.trustIp) {
    options.trustIp.forEach(item => {
      const str = item.replace(/\./g, '\\.') + '$'
      trustIp.push(new RegExp(str))
    })
  }
  if (options.saveToken) {
    tokenList.on('token', options.saveToken)
  }
  if (options.saveTicket) {
    tokenList.on('ticket', options.saveTicket)
  }
  if (options.onError) {
    tokenList.on('error', options.onError)
  }
  tokenList.start()

  app.use(/^\/token|ticket/, (req, res, next) => {
    const ip = req.ip
    const isPass = trustIp.some(item => item.test(ip))
    if (!isPass) {
      return res.status(403).json({
        errmsg: 'This ip is not trusted'
      })
    }
    next()
  })

  app.get('/token/:appName', (req, res) => {
    const { appName } = req.params
    if (!appName) {
      return res.status(400).json({
        errmsg: 'required appName'
      })
    }
    const token = tokenList.getToken(appName)
    if (!token) {
      return res.status(400).json({
        errmsg: 'no this appName:' + appName
      })
    }
    res.setHeader('content-type', 'text/plain')
    res.end(token)
  })

  app.put('/token/:appName', (req, res) => {
    const { appName } = req.params
    if (!appName) {
      return res.status(400).json({
        errmsg: 'required appName'
      })
    }
    tokenList.refreshToken(appName, (err, result) => {
      if (err) {
        return res.status(500).send(err)
      }
      if (!result) {
        return res.status(400).json({
          errmsg: 'no this appName:' + appName
        })
      }
      res.json({
        message: 'ok'
      })
    })
  })

  app.get('/ticket/:appName', (req, res) => {
    const { appName } = req.params
    if (!appName) {
      return res.status(400).json({
        message: 'required appName'
      })
    }
    const ticket = tokenList.getTicket(appName)
    if (!ticket) {
      return res.status(400).json({
        errmsg: 'no this appName:' + appName
      })
    }
    res.setHeader('content-type', 'text/plain')
    res.end(ticket)
  })

  app.put('/ticket/:appName', (req, res) => {
    const { appName } = req.params
    if (!appName) {
      return res.status(400).json({
        message: 'required appName'
      })
    }
    tokenList.refreshTicket(appName, (err, result) => {
      if (err) {
        return res.status(500).send(err)
      }
      if (!result) {
        return res.status(400).json({
          errmsg: 'no this appName:' + appName
        })
      }
      res.json({
        message: 'ok'
      })
    })
  })

  app.get('/js-config/:appName', (req, res) => {
    const { url } = req.query
    const { appName } = req.params
    if (!appName) {
      return res.status(400).json({
        message: 'required appName'
      })
    } else if (!url) {
      return res.status(400).json({
        message: 'required url'
      })
    }
    const jsConfig = tokenList.getJsConfig(appName, url)
    if (!jsConfig) {
      return res.status(400).json({
        errmsg: 'no this appName:' + appName
      })
    }
    return res.json(jsConfig)
  })

  return app
}