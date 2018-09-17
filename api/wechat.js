const {get, post} = require('../utils/http')
const baseUrl = 'https://api.weixin.qq.com/cgi-bin/'
const config = require('../config')
const _ = require('lodash')
const moment = require('moment')
const {ERRORS} = require('../utils/constants')
let constants = require('../utils/constants')
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
                resolve(httpRes.access_token)
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
            if (constants.ACCESS_TOKEN && moment().diff(constants.ACCESS_TOKEN.expires_time, 's') < 0) {
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
                    resolve(httpRes.ticket)
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
 * 更新menu
 * @param {Object} params
 * @returns {Boolean}
 */
const menuCreate = async (params) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!(constants.ACCESS_TOKEN && moment().diff(constants.ACCESS_TOKEN.expires_time, 's') < 0)) {
                try {
                    await accessToken()
                } catch (err) {
                    console.log(err)
                }
            }
            const res = await post(baseUrl + `menu/create?access_token=${constants.ACCESS_TOKEN.access_token}`, params)
            if (res && !res.errcode && res.errmsg === 'ok') {
                resolve(true)
            } else {
                throw new Error(`menuCreate请求失败,错误原因:${JSON.stringify(res)}`)
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 获取用户信息
 */
const getUnionid = async(openid) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!(constants.ACCESS_TOKEN && moment().diff(constants.ACCESS_TOKEN.expires_time, 's') < 0)) {
                try {
                    await accessToken()
                } catch (err) {
                    console.log(err)
                }
            }
            const res = await get(baseUrl + 'user/info', {
                access_token: constants.ACCESS_TOKEN.access_token,
                openid,
                lang: 'zh_CN'
            })
            if (res && !res.errcode && res.unionid) {
                resolve(res.unionid)
            } else {
                throw new Error(`getUnionid请求失败,错误原因:${JSON.stringify(res)}`)
            }
        } catch (e) {
            reject(e)
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

module.exports = {
    accessToken,
    getjssdk,
    menuCreate,
    getUnionid
}
