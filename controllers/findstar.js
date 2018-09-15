const miniprogram  = require('../api/miniprogram')
module.exports = async (ctx) =>{
    try{
        const {name} = ctx.request.body
        let res = await miniprogram.findStarByName(name)
        res = res.map(v=>{ return Object.assign({},v,{id:v._id})})
        ctx.state.data = {
            stars:res
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