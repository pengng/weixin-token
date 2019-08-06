# weixin-token 

**微信公众号 access token 定时更新工具。**

### 示例代码

```bash
npm install weixin-token
```

```javascript
const WeixinTokenManager = require('weixin-token')
const { EVENT_ACCESS_TOKEN, EVENT_JSAPI_TICKET } = WeixinTokenManager

// 微信公众号列表
let list = [
    { appId: '', appSecret: '' }
]

let manager = new WeixinTokenManager(list)

// 绑定全部事件
manager.on(EVENT_ACCESS_TOKEN, ret => {
    console.log(ret)
})
manager.on(EVENT_JSAPI_TICKET, ret => {
    console.log(ret)
})
manager.on('error', err => {
    console.error(err)
})
```

### 当刷新 access token 时触发 access_token 事件

```javascript
manager.on(EVENT_ACCESS_TOKEN, ret => {
    console.log(ret)
    /*
    { access_token: '24_glPQFS1qenYnqTG23B0DAehlHpo2i7TC9NvvJ8mk6Ex60cgBqjCqr-CgiO3VilMLBa5FRG-I1xEu_ApeWK_zXY1eIdsi4NiPCyN_R99c2MuCE8Ip5dl3F1tRY3hJdPqQlRB0KATYFdKUVOFuMMRhAIAQQV',
    expires_in: 7200,
    appId: 'wx74205b421dc1f3eb' }
    */
})
```

### 当刷新 jsapi ticket 时触发 jsapi_ticket 事件

```javascript
manager.on(EVENT_JSAPI_TICKET, ret => {
    console.log(ret)
    /*
    { errcode: 0,
    errmsg: 'ok',
    ticket: 'kgt8ON7yVITDhtdwci0qeSDIFV9vqoFKeFGn3oE4TeJqLFRDlah4R9reRMpMa0cn_lk7FELxreSXV85iFaGy3Q',
    expires_in: 7200,
    appId: 'wx74205b421dc1f3eb' }
    */
})
```

### 当出错时触发 error 事件

```javascript
manager.on('error', err => {
    console.error(err)
})
```

***

### 实例方法：

#### startTokenTimer

**启动 access token 刷新定时器。模块会自动调用该方法。当需要立即刷新 access token 时也可调用。**

```javascript
manager.startTokenTimer(appId)
```

***

#### startTicketTimer

**启动 jsapi ticket 刷新定时器。模块会自动调用该方法。当需要立即刷新 jsapi ticket 时也可调用。**

```javascript
manager.startTicketTimer(appId)
```

### 类方法：

#### getJsApiConfig

**微信浏览器内调用上传图片等jsapi时，需先调用wx.config(config)，传入配置对象。本接口提供配置对象生成。**

- **jsApiTicket** \<string\> jsapi ticket
- **url** \<string\> 网页链接

```javascript
let ret = WeixinTokenManager.getJsApiConfig(jsApiTicket, url)
```