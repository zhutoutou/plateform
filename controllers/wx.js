const config = require('../config')
const crypto = require('crypto')
const {mysql} = require('../wxpay')
const {platform: {msg: {autoRep, focusRep}}} = require('../config')
const {object2XML} = require('../utils/xml')
const {getUnionid} = require('../api/wechat')
const {shouhu} = require('../api/miniprogram')
const moment = require('moment')

/**
 * 查找是否重复消息
 * @param {String} msg_id
 * @returns {Boolean}
 */
const findMsg = async(msg_id) => {
    try {
        const findRes = await mysql('cMessage')
                        .count('msg_id as hasMsg')
                        .where({msg_id: msg_id})
        if (findRes[0].hasMsg) {
            return true
        } else {
            return false
        }
    } catch (e) {
        throw new Error(`Error_cMessage_Select`)
    }
}

/**
 * 保存信息
 * @param {Int} msg_id
 * @param {String} open_id
 * @param {timestamp} req_time
 * @param {timestamp} rep_time
 * @param {Int} state
 * @param {String} msg_info
 */
// eslint-disable-next-line
const saveMsg = async(msg_id, open_id, req_time, rep_time, state, rep_content, msg_info) => {
    const findRes = await findMsg(msg_id)
    if (!findRes) {
        await mysql('cMessage')
            .insert({msg_id, open_id, req_time, rep_time, state, rep_content, msg_info: JSON.stringify(msg_info)})
    } else {
        if (rep_time && rep_content) {
            await mysql('cMessage')
            .update({rep_time, rep_content})
            .where({msg_id})
        }
    }
}

// /**
//  * 查找用户对应的unionid
//  * @param {String} openid
//  * @returns {string}
//  */
// const findUnionId = async(openid) => {
//     try {
//         const findRes = await mysql('cUser')
//                         .find('cUser.unionid')
//                         .where({open_id: openid})
//         if (findRes && findRes.unionid) {
//             return findRes.unionid
//         } else {
//             return ''
//         }
//     } catch (e) {
//         throw new Error(`Error_cMessage_Select`)
//     }
// }

/**
 * 生成text的XML消息
 * @param {String} ToUserName
 * @param {String} FromUserName
 * @param {String} CreateTime
 * @param {String} Content
 */
const textXMLRep = (ToUserName, FromUserName, CreateTime, Content) => {
    return object2XML({
        ToUserName,
        FromUserName,
        CreateTime,
        MsgType: 'text',
        Content
    })
    // return `<xml><ToUserName><![CDATA[${ToUserName}]]></ToUserName><FromUserName><![CDATA[${FromUserName}]]></FromUserName><CreateTime>${CreateTime}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${Content}]]></Content></xml>`
}

const post = async (ctx) => {
    console.log(ctx.request.body)
    const msg_info = ctx.request.body
    const { ToUserName, FromUserName, CreateTime, MsgType, MsgId } = msg_info
    let repContent = 'success'
    try {
        if (MsgType === 'event') {
            const {Event} = msg_info
            if (Event === 'subscribe') {
                console.log('新增用户关注')
                ctx.body = textXMLRep(FromUserName, ToUserName, CreateTime, focusRep)
            } else {
                ctx.body = 'success'
            }
        } else {
            const res = await findMsg(MsgId)
            if (res) {
                console.log('重复的消息')
                ctx.body = 'success'
            } else {
                const reqTime = moment.unix(CreateTime).format('YYYY-MM-DD HH:mm:ss')
                let state = 0 // 消息未处理
                switch (MsgType) {
                    case 'text':
                        const {Content} = msg_info
                        if (Content && Content.indexOf('守护') > -1) {
                            const arr = Content.split('守护')
                            const name = arr.length > 0 ? arr[arr.length - 1] : ''
                            if (!name) {
                                repContent = '请输入要守护的明星'
                                break
                            }
                            const unionid = await getUnionid(FromUserName)

                            if (unionid) {
                                const shouhuRes = await shouhu(unionid, name)
                                state = 1 // 消息已处理
                                repContent = shouhuRes
                            }
                            // let repContent = `守护功能尚未开放,敬请等候（${name}）`
                            // repContent = textXMLRep(FromUserName, ToUserName, CreateTime, repContent)
                        } else {
                            repContent = autoRep
                        }
                        break
                    default:
                        repContent = autoRep
                        break
                }
                let repTime = moment().format('YYYY-MM-DD HH:mm:ss')
                await saveMsg(MsgId, FromUserName, reqTime, repTime, state, repContent, msg_info)
                repTime = moment().unix()
                ctx.body = textXMLRep(FromUserName, ToUserName, repTime, repContent)
            }
        }
    } catch (err) {
        console.log(err)
        ctx.body = 'success'
    }
}

const get = async(ctx) => {
    const {signature, timestamp, nonce, echostr} = ctx.request.body
    const sha1 = crypto.createHash('sha1')
    const sha1Arr = [config.platform.serverToken, timestamp, nonce]
    sha1Arr.sort().map(v => {
        sha1.update(v)
    })
    if (sha1.digest('hex') === signature) ctx.body = echostr
    else {
        console.log('非法连接')
        ctx.state.msg = '非法连接'
    }
}

module.exports = {
    get,
    post
}

