const config = require('../config')
// const debug = require('debug')('platform-sdk')
const {ERRORS} = require('./constants')
let constants = require('./constants')
const {accessToken, getjssdk} = require('../api/wechat')

module.exports = async () => {
    try {
        const {appid, appsecret, platform} = config
        if ([appid, appsecret, platform].every(v => !v)) throw new Error(ERRORS.ERR_INIT_SDK_LOST_CONFIG)

        const {accessTokenUrl, serverToken} = platform
        if ([accessTokenUrl, serverToken].every(v => !v)) throw new Error(ERRORS.ERR_INIT_SDK_LOST_CONFIG)
        console.log('init 获取accessToken')
        // eslint-disable-next-line
        await accessToken()
        if (!constants.ACCESS_TOKEN) throw new Error(ERRORS.ERR_ACCESS_TOKEN_UNFOUND)
        else {
            await getjssdk()
            if (!constants.JSAPI_TICKET) throw new Error(ERRORS.ERR_JSAPI_TICKET_UNFOUND)
            else {
                console.log('init Success')
                console.log(constants)
            }
        }
    } catch (e) {
        console.log(e)
    }
}
