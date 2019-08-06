const crypto = require('crypto')
const querystring = require('querystring')

const { httpGet } = require('./network')

/**
 * 获取 access token
 * @param {string} appid 微信公众号 appid
 * @param {string} secret 微信公众号 app secret
 */
function getAccessToken(appid, secret) {
    let url = 'https://api.weixin.qq.com/cgi-bin/token'
    let query = { grant_type: 'client_credential', appid, secret }

    url += `?${querystring.stringify(query)}`
    
    return httpGet(url)
}

/**
 * 获取 JsApi Ticket
 * @param {string} access_token 接口凭证
 */
function getJsApiTicket(access_token) {
    let url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
    let query = { access_token, type: 'jsapi' }

    url += `?${querystring.stringify(query)}`
    
    return httpGet(url)
}

/**
 * 获取 JsApi Config
 * @param {string} ticket JsApi Ticket
 * @param {string} url 网页链接
 */
function getJsApiConfig(jsapi_ticket, url) {

    let noncestr = Math.random().toString(36).slice(2)                      // 生成随机字符串
    let timestamp = Math.ceil(Date.now() / 1000)                            // 获取当前时间戳
    url = url.split('#').shift()                                            // 去除链接的 hash 部分
    let signature = genSign({ noncestr, timestamp, jsapi_ticket, url })     // 生成签名
    
    return { nonceStr: noncestr, signature, url, timestamp }
}

/**
 * 生成签名
 * @param {object} params 参数表
 */
function genSign(params) {
    let keyValPair = Object.entries(params)

    keyValPair = keyValPair.map(([key, val]) => [key.toLowerCase(), val])       // 将键名全部转为小写

    keyValPair.sort((a, b) => a[0].localeCompare(b[0]))                         // 将字段名按 ASCII 排序

    let rawStr = keyValPair.map(([key, val]) => `${key}=${val}`).join('&')      // 将键和值拼接成键值对，不需要 URL 编码，

    return crypto.createHash('sha1').update(rawStr).digest('hex')
}

module.exports = { getAccessToken, getJsApiTicket, getJsApiConfig }