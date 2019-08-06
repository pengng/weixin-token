const EventEmitter = require('events')
const { getAccessToken, getJsApiTicket, getJsApiConfig } = require('./wechat')

// 事件列表
const EVENT_ACCESS_TOKEN = 'access_token'           // 当 access token 更新时触发
const EVENT_JSAPI_TICKET = 'jsapi_ticket'           // 当 jsapi ticket 更新时触发

const DELAY_UPPER_LIMIT = Math.pow(2, 31) - 1       // setTimeout 的延时上限值
const REFRESH_INTERVAL = 1000 * 60 * 110            // 刷新间隔，单位：毫秒。1小时50分钟
const RETRY_TIMEOUT = 1000                          // 重试的超时时间，单位：毫秒。

/**
 * {
 *      [appId]: {
 *          appId: '',
 *          appSecret: '',
 *          access_token: '',
 *          ticket: '',
 *          tokenTimer: 0,
 *          ticketTimer: 0,
 *          retryTokenTimes: 0,
 *          retryTicketTimes: 0
 *      }
 * }
 */
let accountMap = {}                                 // 微信公众号记录表

class Manager extends EventEmitter {
    constructor(list) {
        super()

        /* 绑定事件 [[ */
        this.on(EVENT_ACCESS_TOKEN, this.onRefreshAccessToken.bind(this))
        this.on(EVENT_JSAPI_TICKET, this.onRefreshJsApiTicket.bind(this))
        /* 绑定事件 ]] */

        list.forEach(({ appId, appSecret }) => accountMap[appId] = { appSecret })                       // 储存账户列表
        Object.keys(accountMap).forEach(this.startTokenTimer.bind(this))                                // 使用去重后的APPID
    }

    // 当 access token 更新时触发
    onRefreshAccessToken(data) {
        let { appId } = data
        Object.assign(accountMap[appId], data)
        if (!accountMap[appId].ticketTimer) {                                                           // 只启动一次即可
            this.startTicketTimer(appId)                                                                // 定时刷新 JsApi Ticket
        }
    }

    // 当 JsApi Ticket 更新时触发
    onRefreshJsApiTicket(data) {
        let { appId } = data
        Object.assign(accountMap[appId], data)
    }

    /**
     * 定时刷新 access token
     * @param {string} appId 微信公众号 APPID
     */
    async startTokenTimer(appId) {
        let { appSecret, retryTokenTimes = 0 } = accountMap[appId]
        let timeout = 0

        try {
            let ret = await getAccessToken(appId, appSecret)                                            // 刷新 access token
            Object.assign(ret, { appId })
            this.emit(EVENT_ACCESS_TOKEN, ret)                                                          // 触发 access token 更新事件
            timeout = REFRESH_INTERVAL
            accountMap[appId].retryTokenTimes = 0                                                       // 如果成功调用，则重试次数和间隔时长回到初始值

        } catch (err) {
            this.emit('error', err)
            timeout = Math.min(RETRY_TIMEOUT * Math.pow(2, retryTokenTimes), DELAY_UPPER_LIMIT)         // 重试的间隔时长按指数级增长，且不大于 setTimeout 的上限值
            accountMap[appId].retryTokenTimes = retryTokenTimes + 1                                     // 更新重试次数
        }

        clearTimeout(accountMap[appId].tokenTimer)                                                      // 清理旧的定时器
        accountMap[appId].tokenTimer = setTimeout(this.startTokenTimer.bind(this, appId), timeout)      // 设置新的定时器
    }

    /**
     * 定时刷新 jsapi ticket
     * @param {string} appId 微信公众号 APPID
     */
    async startTicketTimer(appId) {
        let { access_token, retryTicketTimes = 0 } = accountMap[appId]
        let timeout = 0

        try {
            let ret = await getJsApiTicket(access_token)                                                // 刷新 jsapi ticket
            Object.assign(ret, { appId })
            this.emit(EVENT_JSAPI_TICKET, ret)                                                          // 触发 jsapi ticket 更新事件
            timeout = REFRESH_INTERVAL
            accountMap[appId].retryTicketTimes = 0                                                      // 如果成功调用，则重试次数和间隔时长回到初始值

        } catch (err) {
            this.emit('error', err)
            timeout = Math.min(RETRY_TIMEOUT * Math.pow(2, retryTicketTimes), DELAY_UPPER_LIMIT)        // 重试的间隔时长按指数级增长，且不大于 setTimeout 的上限值
            accountMap[appId].retryTicketTimes = retryTicketTimes + 1                                   // 更新重试次数
        }

        clearTimeout(accountMap[appId].ticketTimer)                                                     // 清理旧的定时器
        accountMap[appId].ticketTimer = setTimeout(this.startTicketTimer.bind(this, appId), timeout)    // 设置新的定时器
    }
}

Object.assign(Manager, { EVENT_ACCESS_TOKEN, EVENT_JSAPI_TICKET, getJsApiConfig })

module.exports = Manager