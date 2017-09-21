const TokenList = require('./tokenList')
const app = require('express').Router()

module.exports = options => {
  const tokenList = new TokenList(options.list)
  if (options.saveToken) {
    tokenList.on('token', options.saveToken)
  }
  if (options.saveTicket) {
    tokenList.on('ticket', options.saveTicket)
  }

  app.get('/token/:appName', (req, res) => {
    const { appName } = req.params
    if (!appName) {
      return res.status(400).json({
        message: 'required appName'
      })
    }
    res.end(tokenList.getToken(appName))
  })

  app.put('/token/:appName', (req, res) => {
    // refresh
  })

  app.get('/ticket/:appName', (req, res) => {
    const { appName } = req.params
    if (!appName) {
      return res.status(400).json({
        message: 'required appName'
      })
    }
    res.end(tokenList.getTicket(appName))
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
    tokenList.getJsConfig(appName, url, (err, result) => {
      if (err) {
        return res.status(500).send(err)
      }
      res.json(result)
    })
  })

  return app
}