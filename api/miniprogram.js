const {post} = require('../utils/http')
const baseUrl = 'https://www.pkfis.cn/api/'

/**
 * 获取openid
 * @param {String} unionId 平台唯一ID
 * @returns {Promise} openid
 */
const findOpenidByUid = (unionId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const res = await post(baseUrl + 'findOpenidByUid', {unionId})
            if (res && res.result && res.data) {
                resolve(res.data.openid)
            } else {
                throw new Error(`请求失败,错误原因:${res.error}`)
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 获取openid
 * @param {String} openid 小程序openid
 * @returns {Object} userinfo
 */
const findUserById = (openid) => {
    return new Promise(async(resolve, reject) => {
        try {
            const res = await post(baseUrl + 'findUserById', {openid, n: 20})
            if (res && res.result && res.data) {
                resolve(res.data)
            } else {
                throw new Error(`请求失败,错误原因:${res.error}`)
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 获取star
 * @param {String} name 关键字
 * @returns {Object} starlist
 */
const findStarByName = (name) => {
    return new Promise(async(resolve, reject) => {
        try {
            const res = await post(baseUrl + 'findStarByName', {name})
            if (res && res.result && res.data) {
                resolve(res.data)
            } else {
                throw new Error(`请求失败,错误原因:${res.error}`)
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 打榜
 * @param {String} unionId 平台唯一ID
 * @returns {Promise} openid
 */
const hitFans = (openid, starid, count) => {
    return new Promise(async(resolve, reject) => {
        try {
            const res = await post(baseUrl + 'hitFans', {openid, starid, count})
            if (res && res.result && res.data) {
                resolve(res.data)
            } else {
                throw new Error(`请求失败,错误原因:${res.error}`)
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 守护
 * @param {String} unionId 用户的唯一Id
 * @param {String} name 明星姓名
 * @returns {Promise}
 */
const shouhu = (unionId, name) => {
    return new Promise(async(resolve, reject) => {
        try {
            const res = await post(baseUrl + 'shouhu', {unionId, name})
            let rep
            if (res && res.result && res.data) {
                rep = '守护成功^_^'
            } else if (res.error) {
                switch(res.error){
                    case '没有该明星团':
                        rep = '该明星还没有入驻,换一个试试吧'
                        break
                    case '没有该角色':
                        rep = '你还没有自己的爱豆,先去小程序关注自己的爱豆吧'
                        break
                    case '今日已经签到了':
                        rep = '一天只能守护一次,明天再来哦'
                        break
                    default:
                        rep = res.error
                        break
                }
            } else {
                console.log(`请求失败,错误原因:${JSON.stringify(res)}`)
                throw new Error(`请求失败,错误原因:${JSON.stringify(res)}`)
            }
            resolve(rep)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    findOpenidByUid,
    findStarByName,
    findUserById,
    hitFans,
    shouhu
}
