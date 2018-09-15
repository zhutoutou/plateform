const {post} = require('../utils/http')
const baseUrl = 'https://www.pkfis.cn/api/'

/**
 * 获取openid
 * @param {String} unionId 平台唯一ID
 * @returns {Promise} openid
 */
const findOpenidByUid = (unionId) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const res = await post(baseUrl + 'findOpenidByUid',{unionId})
            if(res && res.result && res.data){
                resolve(res.data.openid)
            } else {
                throw new Error(`请求失败,错误原因:${res.error}`)
            }
        }catch(e){
            reject(e)
        }
    })
}

/**
 * 获取openid
 * @param {String} openid 小程序openid
 * @returns {Object} userinfo
 */
const findUserById = (openid) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const res = await post(baseUrl + 'findUserById',{openid,n:20})
            if(res && res.result && res.data){
                resolve(res.data)
            } else {
                throw new Error(`请求失败,错误原因:${res.error}`)
            }
        }catch(e){
            reject(e)
        }
    })
}

/**
 * 获取star
 * @param {String} name 关键字
 * @returns {Object} starlist
 */
const findStarByName = (name) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const res = await post(baseUrl + 'findStarByName',{name})
            if(res && res.result && res.data){
                resolve(res.data)
            } else {
                throw new Error(`请求失败,错误原因:${res.error}`)
            }
        }catch(e){
            reject(e)
        }
    })
}

/**
 * 获取openid
 * @param {String} unionId 平台唯一ID
 * @returns {Promise} openid
 */
const hitFans = (openid,starid,count) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const res = await post(baseUrl + 'hitFans',{openid,starid,count})
            if(res && res.result && res.data){
                resolve(res.data)
            } else {
                throw new Error(`请求失败,错误原因:${res.error}`)
            }
        }catch(e){
            reject(e)
        }
    })
}

module.exports ={
    findOpenidByUid,
    findStarByName,
    findUserById,
    hitFans
}