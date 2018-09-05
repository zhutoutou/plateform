module.exports = ctx => {
    console.log('test', ctx.request.body)
    ctx.body = ctx.request.body
}
