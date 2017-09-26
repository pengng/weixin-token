# weixin-token

wechat access_token middleware

### Description

> 此模块用于管理多个微信公众号的`access_token`和`jsApi Config`。内部自动刷新，保证`access_token`总是最新可用的，并且提供接口供外部调用。目的是简化管理多个微信公众号时，接口调用的复杂性。
>
> This module is used to manage `access_token` and `jsApi Config` for multiple micro-public numbers. Internal auto refresh to ensure that access_token is always up-to-date and provides an interface for external calls. The purpose is to simplify the management of multiple WeChat public numbers when the complexity of interface calls.

> 建议一个地方管理多个微信公众号`access_token`的使用，当出现错误时便于定位错误代码和修正。

### Usage

```bash
npm i weixin-token -S
```

```javascript
const app = require('express')()
const wechatToken = require('weixin-token')

const config = {
  list: [
    {
      appName: '',
      appId: '',
      appSecret: ''
    }
  ],
  saveToken: result => {

  },
  saveTicket: result => {

  },
  onError: err => {

  },
  trustIp: [
    '192.168.1.115'
  ]
}

app.use(wechatToken(config))

app.listen(3000, () => {
  console.log('server start at 3000')
})
```

| 名称         | 类型       | 必填   | 描述                                       |
| ---------- | -------- | ---- | ---------------------------------------- |
| list       | array    | 是    | 微信公众号`appId`和`appSecret`配置对象列表。<br/>用于管理多个公众号的`access_token`。`appName`也是必须的，用于在调用接口时传入，指定要操作的某个公众号。 |
| trushIp    | array    | 否    | [信任ip列表](#truship)                       |
| saveToken  | function | 否    | [保存`access_token`的函数](#savetoken)        |
| saveTicket | function | 否    | [保存`jsapi_ticket`的函数](#saveticket)       |
| onError    | function | 否    | 推荐传入自定义函数。当内部抛出错误时，会触发此函数执行，此时可自行处理错误。   |

### trustIp

> 信任ip列表用于安全访问**获取access_token**等接口。包含在该数组中的机器ip才可以调用全部接口。默认允许`localhost`和`127.0.0.1`的方式访问全部接口，也可以传入自定义数组，允许更多ip访问。如`[ '183.29.7.22', '220.83.100.64' ]`

### saveToken

> 可选配置，如果需要保存最新的`access_token`到数据库,可自定义一个函数传入。可接收到`result`对象，对象上包含`access_token`、`appName`、`appId`、`expires_in`等属性，可自行利用。

### saveTicket

> 可选配置，如果需要保存最新的`ticket`到数据库,可自定义一个函数传入。可接收到`result`对象，对象上包含`ticket`、`appName`、`appId`、`expires_in`等属性，可自行利用。

## HTTP 接口

### 获取access_token

```
GET /token/appname HTTP/1.1
Host: localhost:3000
```

```
HTTP/1.1 200 OK
Date: Thu, 21 Sep 2017 10:51:44 GMT
Content-Type: text/plain

G8rZshDUKj1p3WAia70g4m-yh53aW6Fl0P1pkbAm6J5ULP7L8f1oZxtOraTEVTItYimanSrh0Gehoa4wf7j37UR3M6vGB_8P6q7qjuTr_2rVfBMNgHBq9IiEtMsKCaQaDBDhAFATRT
```

> `request`库使用示例

```javascript
const request = require('request')
const url = 'http://localhost:3000/token/appname' // appname对应配置中的appName的值

request(url, (err, response, body) => {
  if (err) {
    return console.error(err)
  }
  console.log(body)
})

// G8rZshDUKj1p3WAia70g4m-yh53aW6Fl0P1pkbAm6J5ULP7L8f1oZxtOraTEVTItYimanSrh0Gehoa4wf7j37UR3M6vGB_8P6q7qjuTr_2rVfBMNgHBq9IiEtMsKCaQaDBDhAFATRT
```

### 刷新access_token

```
PUT /token/appname HTTP/1.1
Host: localhost:3000
```

```
HTTP/1.1 200 OK
Date: Thu, 21 Sep 2017 10:51:44 GMT
Content-Type: application/json

{"message": "ok"}
```

> 接口用于因其他因素导致`access_token`提前失效时，强制刷新`access_token`。正常情形下，模块内部会定时在`access_token`即将失效时自动刷新（提前30秒），保持`access_token`一直处于可用状态。外部只管调用即可。
> <br/>
> 如果`access_token`总是频繁失效，请检查是否有其他项目使用了`appId`和`appSecret`获取`access_token`。

```javascript
const request = require('request')
const url = 'http://localhost:3000/token/appname'
const options = {
  url: url,
  method: 'put',
  json: true
}

request(options, (err, response, body) => {
  if (err) {
    return console.error(err)
  }
  console.log(body)
})

/*
  { message: 'ok' }
**/
```

### 获取jsapi ticket

```
GET /ticket/appname HTTP/1.1
Host: localhost:3000
```

```
HTTP/1.1 200 OK
Date: Thu, 21 Sep 2017 10:51:44 GMT
Content-Type: text/plain

kgt8ON7yVITDhtdwci0qeSDIFV9vqoFKeFGn3oE4TeLu7ZMSXd8oqn0FfcfrBV7Q0Do7yZRX-PRSrReunCwN1A
```

### 刷新jsapi ticket

```
PUT /ticket/appname HTTP/1.1
Host: localhost:3000
```

```
HTTP/1.1 200 OK
Date: Thu, 21 Sep 2017 10:51:44 GMT
Content-Type: application/json

{"message": "ok"}
```

### 获取jsapi config

微信浏览器内调用上传图片等jsapi时，需先调用wx.config(config)，传入配置对象。本接口提供配置对象生成。

```
GET /js-config/appname?url=http://host.com/path/to/resource HTTP/1.1
Host: localhost:3000
```

```
HTTP/1.1 200 OK
Date: Thu, 21 Sep 2017 10:51:44 GMT
Content-Type: application/json

{
  "timestamp":"1506415650",
  "url":"http://host.com/path/to/resource",
  "signature":"3447fed531f1c2b34d70f0e2953e348a2ff76872",
  "appId":"wx74205b421dc1f3eb",
  "nonceStr":"X9LoMEjK2GJ"
}
```
> 通过`query`传递`url`时，`url`要注意编码，如下

```javascript
location.href = 'http://example.host.com/appName?url=' + encodeURIComponent(location.href)
```

