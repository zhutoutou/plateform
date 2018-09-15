const miniprogram  = require('../api/miniprogram')
module.exports = async (ctx) =>{
    try{
        const {unionid} = ctx.request.body
        const miniopenid = await miniprogram.findOpenidByUid(unionid)
        ctx.state.data = {
            miniopenid
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