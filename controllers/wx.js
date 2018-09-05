const config = require('../config')
const crypto = require('crypto')
module.exports = async (ctx) => {
    const {signature, timestamp, nonce, echostr} = ctx.request.body
    const sha1 = crypto.createHash('sha1')
    const sha1Arr = [config.platform.serverToken, timestamp, nonce]
    sha1Arr.sort().map(v => {
        sha1.update(v)
    })
    if (sha1.digest('hex') === signature) ctx.body = echostr
    else {
        console.log('非法连接')
        ctx.state.msg = '非法连接'
    }
}
