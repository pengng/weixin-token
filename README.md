# weixin-token

wechat access_token middleware

### Description

> 此模块用于管理多个微信公众号的`access_token`和`jsApi Config`。内部自动刷新，保证`access_token`总是最新可用的，并且提供接口供外部调用。目的是简化管理多个微信公众号时，接口调用的复杂性。
>
> This module is used to manage `access_token` and `jsApi Config` for multiple micro-public numbers. Internal auto refresh to ensure that access_token is always up-to-date and provides an interface for external calls. The purpose is to simplify the management of multiple WeChat public numbers when the complexity of interface calls.

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
  onerror: err => {

  },
  trushIp: [
    '192.168.1.115'
  ]
}

app.use(wechatToken(config))

app.listen(3000, () => {
  console.log('server start at 3000')
})
```

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

```
GET /js-config/appname?url=http://host.com/path/to/resource HTTP/1.1
Host: localhost:3000
```

```
HTTP/1.1 200 OK
Date: Thu, 21 Sep 2017 10:51:44 GMT
Content-Type: application/json

{
  "timestamp":1505991638792,
  "url":"http://host.com/path/to/resource",
  "jsapi_ticket":"kgt8ON7yVITDhtdwci0qeSDIFV9vqoFKeFGn3oE4TeLu7ZMSXd8oqn0FfcfrBV7Q0Do7yZRX-PRSrReunCwN1A",
  "signature":"3447fed531f1c2b34d70f0e2953e348a2ff76872",
  "appId":"wx74205b421dc1f3eb",
  "nonceStr":"X9LoMEjK2GJ"
}
```