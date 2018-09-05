module.exports = (ctx) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$orderInfo
    if (ctx.state.$orderInfo && ctx.state.$orderInfo.data) {
        ctx.state.data = ctx.state.$orderInfo.data
    } else {
        ctx.state = {
            code: -1,
            data: {
                msg: ctx.state.$orderInfo.err
            }
        }
    }
}
