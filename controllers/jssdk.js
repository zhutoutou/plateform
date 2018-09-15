const constants = require('../utils/constants')
const moment = require('moment')
const {sign} = require('../utils/sign')
const {platform: {appId}} = require('../config')
module.exports = async (ctx) => {
    try {
        if (!constants.JSAPI_TICKET) throw new Error('JSAPI_TICKET not Found')
        // eslint-disable-next-line
        const jsapi_ticket = constants.JSAPI_TICKET.ticket
        const {url} = ctx.request.body
        const timestamp = moment().format('X')
        const nonceStr = Math.floor(Math.random() * 10000000).toString()
        if (url === undefined) throw new Error('params missing')
        // eslint-disable-next-line
        const signature = sign({noncestr:nonceStr, jsapi_ticket,timestamp, url },true)
        ctx.state.data = {
            appId,
            url,
            timestamp,
            nonceStr,
            signature
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
