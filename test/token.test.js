const assert = require('assert')
const Token = require('../lib/token')

describe('test token.js', function () {
  const appName = 'test'
  const appId = ''
  const appSecret = ''
  let token = null
  it('test constructor()', function () {
    token = new Token(appName, appId, appSecret)
    assert.equal(token.appName, appName)
    assert.equal(token.appId, appId)
    assert.equal(token.appSecret, appSecret)
  })
  it('test getToken()', function (done) {
    token.getToken(function (err, result) {
      assert.equal(err, null)
      assert(result.access_token)
      assert(result.expires_in)
      done()
    })
  })
  it('test getTicket()', function (done) {
    token.getTicket(function (err, result) {
      assert.equal(err, null)
      assert(result.ticket)
      assert(result.expires_in)
      done()
    })
  })
  it('test getJsConfig()', function (done) {
    const url = 'https://google.com'
    token.getJsConfig(url, function (err, result) {
      assert.equal(err, null)
      assert.equal(result.appId, appId)
      assert.equal(result.url, url)
      assert.equal(typeof result.timestamp, 'number')
      assert(result.jsapi_ticket)
      assert(result.signature)
      assert(result.nonceStr)
      done()
    })
  })
  it('test getSignature()', function () {
    const signature = 'ec2aced8907a2760c8313ada9f66d3097c46c7f6'
    const query = {
      noncestr: '5DjJvcH1nLj',
      timestamp: 1505975269740,
      url: 'https://google.com',
      jsapi_ticket: 'kgt8ON7yVITDhtdwci0qeSDIFV9vqoFKeFGn3oE4TeIuBO77GoGXo8dy74aCkLxu5WIQY5BP5iu5_6z-7NJDEQ'
    }
    const result = token.getSignature(query)
    assert.equal(result, signature)
  })
  it('test formatUrl()', function () {
    const url = 'https://google.com/#/path/to/resource'
    const newUrl = 'https://google.com/'
    const result = token.formatUrl(url)
    assert.equal(result, newUrl)
  })
})