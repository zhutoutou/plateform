const {mysql} = require('../wxpay')
module.exports = async (ctx) => {
    try {
        console.log('Enter HasC')
        const {unionId} = ctx.request.body
        const findRes = await mysql('cOrder')
                        .count('unionId as hasOrder')
                        .where({unionId, state: 2})
                        // .where({unionId, state: 2})
        console.log(findRes[0].hasOrder)
        ctx.state.data = !!findRes[0].hasOrder
    } catch (err) {
        ctx.state = {
            code: -1,
            data: {
                msg: err.message
            }
        }
    }
}
