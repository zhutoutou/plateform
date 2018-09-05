/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/wx'
})

const controllers = require('../controllers')

// 从 sdk 中取出中间件
const { order: {notifyorderMiddleware, unifiedorderMiddleware}, sign: {signMiddleware} } = require('../wxpay')

// GET 验证服务
router.get('/', controllers.wx)
// GET 公众号登陆请求
router.get('/login', controllers.login)
// GET 公众号授权
router.get('/oauth2',controllers.ouath2)
// GET 公众号SKD配置获取
router.get('/jssdk',controllers.jssdk)
// GET 统一下单接口
router.get('/unified', unifiedorderMiddleware, controllers.unified)
// GET 支付通知接口
router.post('/notify', notifyorderMiddleware, controllers.notify.post)
// GET 签名验证测试接口
router.get('/test', signMiddleware, controllers.test)

module.exports = router
