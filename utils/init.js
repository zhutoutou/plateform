const config = require('../config')
const {get} = require('../utils/http')
// const debug = require('debug')('platform-sdk')
const _ = require('lodash')
const moment = require('moment')
const {ERRORS} = require('./constants')
let constants = require('./constants')
/**
 * 获取access_Token
 */
async function accessToken () {
    return new Promise(async (resolve, reject) => {
        try {
            let httpRes = await get(config.platform.accessTokenUrl,
                {
                    grant_type: 'client_credential',
                    appid: config.platform.appId,
                    secret: config.platform.appSecret
                }
            )
            console.log(httpRes.access_token, httpRes.expires_in)
            if (!httpRes || httpRes.errcode) {
                // debug(`${ERRORS.ERR_GET_ACCESS_TOKEN}\ncode:${httpRes.errcode},Msg:${httpRes.errmsg}`)
                throw (new Error(`${ERRORS.ERR_GET_ACCESS_TOKEN}\ncode:${httpRes.errcode},Msg:${httpRes.errmsg}`))
            } else if (!(httpRes.access_token && httpRes.expires_in)) {
                throw (new Error(`${ERRORS.ERR_ACCESS_TOKEN_UNFOUND}`))
            } else {
                console.log(`更新Token${httpRes.access_token}`)
                accessTokenDely(httpRes.expires_in - 600)
                // eslint-disable-next-line
                const expires_time = moment().add(httpRes.expires_in, 'seconds')
                constants.ACCESS_TOKEN = {
                    'access_token': httpRes.access_token,
                    'expires_time': expires_time
                }
                resolve()
            }
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * 获取JSAPI_TICKET
 */
async function getjssdk () {
    return new Promise(async (resolve, reject) => {
        try {
            if (moment().diff(constants.ACCESS_TOKEN.expires_time, 's') < 0) {
                let httpRes = await get(config.platform.getjssdkUrl,
                    {
                        access_token: constants.ACCESS_TOKEN.access_token,
                        type: 'jsapi'
                    }
                )
                if (!httpRes || httpRes.errcode) {
                    // debug(`${ERRORS.ERR_GET_ACCESS_TOKEN}\ncode:${httpRes.errcode},Msg:${httpRes.errmsg}`)
                    throw (new Error(`${ERRORS.ERR_GET_JSAPI_TICKET}\ncode:${httpRes.errcode},Msg:${httpRes.errmsg}`))
                } else if (!(httpRes.ticket && httpRes.expires_in)) {
                    throw (new Error(`${ERRORS.ERR_JSAPI_TICKET_UNFOUND}`))
                } else {
                    console.log(`更新Ticket${httpRes.ticket}`)
                    getjssdkDely(httpRes.expires_in - 600)
                     // eslint-disable-next-line
                    const expires_time = moment().add(httpRes.expires_in, 'seconds')
                    constants.JSAPI_TICKET = {
                        'ticket': httpRes.ticket,
                        'expires_time': expires_time
                    }
                    resolve()
                }
            } else {
                await accessToken()
                await getjssdk()
            }
        } catch (err) {
            reject(err)
        }
    })
}

/**
 *  延时执行下一次获取AccessToken的时间
 */
const accessTokenDely = (time) => {
    _.debounce(accessToken, 1000 * time, { 'maxWait': 1000 * 60 * 120 })
}

/**
 * 延时执行下一次获取GetjssdkTick的时间
 */
const getjssdkDely = (time) => {
    _.debounce(getjssdk, 1000 * time, { 'maxWait': 1000 * 60 * 120 })
}

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
