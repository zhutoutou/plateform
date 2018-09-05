const config = require('config')
const http = require('axios')
const debug = require('debug')('platform-sdk')
const {ERRORS} = require('./constants')
/**
 * 获取access_Token
 */
async function accessToken () {
    let httpRes = await http({
        method: 'get',
        url: config.platform.accessTokenUrl,
        data: {
            grant_type: 'client_credential',
            appid: config.appid,
            secret: config.appsecret
        }
    })
    httpRes = httpRes.data
    if (!httpRes || httpRes.errcode || httpRes.errmsg) {
        // debug(`${ERRORS.ERR_GET_ACCESS_TOKEN}\ncode:${httpRes.errcode},Msg:${httpRes.errmsg}`)
        throw (new Error(`${ERRORS.ERR_GET_ACCESS_TOKEN}\ncode:${httpRes.errcode},Msg:${httpRes.errmsg}`))
    } else {
        debug(`更新Token${httpRes.access_token}`)
        return {
            'access_token': httpRes.access_token,
            'expires_in': httpRes.expires_in
        }
    }
}

module.exports = function init () {
    const {appid, appsecret, platform} = config
    if ([appid, appsecret, platform].every(v => !v)) throw new Error(ERRORS.ERR_INIT_SDK_LOST_CONFIG)

    const {accessTokenUrl, serverToken} = platform
    if ([accessTokenUrl, serverToken].every(v => !v)) throw new Error(ERRORS.ERR_INIT_SDK_LOST_CONFIG)

    return {
        accessToken
    }
}
