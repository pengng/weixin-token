const wechatToken = require('./index')

const config = {
  list: [
    {
      appName: 'neurooyuer',
      appId: '',
      appSecret: ''
    }
  ],
  saveToken: result => {
    
  },
  saveTicket: result => {
    
  }
}

app.use(wechatToken(config))
