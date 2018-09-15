const miniprogram  = require('../api/miniprogram')
module.exports = async (ctx) =>{
    try{
        const {openid,starid,count} = ctx.request.body
        const res = await miniprogram.hitFans(openid,starid,count)
        ctx.state.data = {
            msg:res
        }
    } catch (err) {
        ctx.state = {
            code:-1,
            data:{
                msg:err.message
            }
        }
    }
}