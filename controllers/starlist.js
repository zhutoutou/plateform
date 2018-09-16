const miniprogram = require('../api/miniprogram')
module.exports = async (ctx) => {
    try {
        const {openid} = ctx.request.body
        const res = await miniprogram.findUserById(openid)
        ctx.state.data = {
            stars: res.stars
        }
    } catch (err) {
        ctx.state = {
            code: -1,
            data: {
                msg: err.message
            }
        }
    }
}
