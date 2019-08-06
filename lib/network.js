const https = require('https')

/**
 * 通用错误
 * @param {string} message 错误消息
 */
function WeixinTokenError(message) {
    this.name = 'WeixinTokenError',
    this.message = message
    Error.captureStackTrace(this, WeixinTokenError)
}
WeixinTokenError.prototype = Object.create(Error.prototype)

// 获取可读流主体
function getBody(readable) {
    return new Promise(function (resolve, reject) {
        let buf = []
        readable.on('error', reject) // 处理 error 事件
            .on('data', Array.prototype.push.bind(buf))
            .on('end', function () {
                let body = Buffer.concat(buf) // 拼接数据流
                resolve(body)
            })
    })
}

/**
 * 发送 https get 请求
 * @param {string} url 请求的URL
 */ 
function httpGet(url) {
    return new Promise(function (resolve, reject) {
        // 发送 HTTPS GET 请求
        let req = https.get(url, async function (res) {
            try {
                let body = await getBody(res) // 获取响应主体
                let rawBody = body.toString()
                let ret = JSON.parse(rawBody) // 解析JSON数据
                let { errcode, errmsg } = ret
                if (errcode) {
                    throw new WeixinTokenError(errmsg)
                }

                resolve(ret)
            } catch(err) {
                reject(err)
            }
        })
        req.on('error', reject)
    })
}

module.exports = { httpGet }