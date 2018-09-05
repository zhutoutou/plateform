const path = require('path')
const fs = require('fs')
/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/page'
})

const main = ctx => {
    console.log('mian Enter')
    ctx.response.type = 'html'
    ctx.response.body = fs.createReadStream(path.join(__dirname, '../dist/index.html'))
}

const login = ctx => {
    ctx.response.type = 'html'
    ctx.response.body = fs.createReadStream(path.join(__dirname, '../dist/login.html'))
}
// 登陆页面
router.get('/login', login)
// 公众号页面
router.get('/', main)

module.exports = router
