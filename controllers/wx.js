// const config = require('../config')
// const crypto = require('crypto')
const {mysql} = require('../wxpay')
const {platform: {msg: {autoRep, focusRep}}} = require('../config')
const {xml2Object} = require('../utils/xml')
// const {shouhu} = require('../api/miniprogram')

/**
 * 查找是否重复消息
 * @param {String} msgid
 * @returns {Boolean}
 */
const findMsg = async(msgid) => {
    try {
        const findRes = await mysql('cMessage')
                        .count('msg_id as hasMsg')
                        .where({msg_id: msgid})
        if (findRes[0].hasMsg) {
            return true
        } else {
            return false
        }
    } catch (e) {
        throw new Error(`Error_cMessage_Select`)
    }
}

const saveMsg = async(ToUserName, FromUserName, CreateTime, MsgType, MsgId) => {

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
    return xml2Object({
        ToUserName,
        FromUserName,
        CreateTime,
        MsgType: 'text',
        Content
    })
}

module.exports = async (ctx) => {
    console.log(ctx.request.body)
    const { ToUserName, FromUserName, CreateTime, MsgType, MsgId } = ctx.request.body
    try {
        if (MsgType === 'event') {
            const {Event} = ctx.request.body
            if (Event === 'subscribe') {
                console.log('新增用户关注')
                ctx.body = textXMLRep(FromUserName, ToUserName, CreateTime, focusRep)
            } else { ctx.body = 'success' }
        } else {
            // const res = await findMsg(MsgId)
            // if (res) {
            //     console.log('重复的消息')
            //     ctx.body = 'success'
            // } else {
            switch (MsgType) {
                case 'text':
                    const {Content} = ctx.request.body
                    if (Content && Content.contains('守护')) {
                        const arr = Content.split('守护')
                        const name = arr.length > 0 ? arr[arr.length - 1] : ''
                            // const unionid = await findUnionId(FromUserName)
                            // let repContent = '请先去明星风云榜小程序关注爱豆吧'
                            // if (unionid) {
                            //     repContent = await shouhu(unionid, name)
                            // }
                        let repContent = `守护功能尚未开放,敬请等候（${name}）`
                        ctx.body = textXMLRep(FromUserName, ToUserName, CreateTime, repContent)
                    } else {
                        ctx.body = textXMLRep(FromUserName, ToUserName, CreateTime, autoRep)
                    }
                    break
                default:
                    ctx.body = textXMLRep(ToUserName, FromUserName, CreateTime, autoRep)
                    break
            //     }
            }
        }
    } catch (err) {
        console.log(err)
        ctx.body = ''
    }
    // const {signature, timestamp, nonce, echostr} = ctx.request.body
    // const sha1 = crypto.createHash('sha1')
    // const sha1Arr = [config.platform.serverToken, timestamp, nonce]
    // sha1Arr.sort().map(v => {
    //     sha1.update(v)
    // })
    // if (sha1.digest('hex') === signature) ctx.body = echostr
    // else {
    //     console.log('非法连接')
    //     ctx.state.msg = '非法连接'
    // }
}
