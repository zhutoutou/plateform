async function post (ctx) {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$orderInfo
    // 具体查看：
    if (ctx.state.$orderInfo && ctx.state.$orderInfo.data) {
        console.log('验证成功')
        ctx.body = ctx.state.$orderInfo.data
    } else {
        console.log(ctx.state.$orderInfo.err)
        ctx.state = {
            code: -1,
            data: {
                msg: ctx.state.$orderInfo.err
            }
        }
    }
}

module.exports = {
    post
}

