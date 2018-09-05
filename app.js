const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const config = require('./config')
const path = require('path')
const fs = require('fs')
const moment = require('moment')
const {bodyParser} = require('./wxpay')

// 引入微信服务器认证Token /name
app.use(require('koa-static')(path.join(__dirname, '/static')))

app.use(require('koa-static')(path.join(__dirname, '/dist')))

// 使用响应处理中间件
app.use(response)

// {"request":{"method":"POST","url":"/wx/notify","header":{"x-real-ip":"140.207.54.76","host":"localhost:5757","connection":"close","content-length":"767","accept":"*/*","pragma":"no-cache","user-agent":"Mozilla/4.0","content-type":"text/xml"}},"response":{"status":404,"message":"Not Found","header":{}},"app":{"subdomainOffset":2,"proxy":false,"env":"development"},"originalUrl":"/wx/notify","req":"<original node req>","res":"<original node res>","socket":"<original node socket>"}

app.use(async (ctx, next) => {
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}  method:${ctx.request.method}   url:${ctx.request.url}  remoteIP:${ctx.request.header['x-real-ip']}`)
    await next()
})

// 解析请求体
app.use(bodyParser())

// 引入微信公众号登陆页面的路由

// 引入前台路由分发
const vueRouter = require('./routes/vue-route')
app.use(vueRouter.routes())

// 引入后台路由分发
const router = require('./routes')
app.use(router.routes())

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
