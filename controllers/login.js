const {get} = require('../utils/http')
const config = require('../config')
const {mysql} = require('../wxpay')
// eslint-disable-next-line
const saveUserInfo = async(openid, access_token, refresh_token, expires_in, unionid, userinfo) => {
    const findRes = await mysql('cUser')
                            .count('open_id as hasUser')
                            .where({open_id:openid})
    if (!findRes[0].hasUser) {
        await mysql('cUser')
                .insert({open_id:openid, access_token, refresh_token, expires_in, unionid, user_info:JSON.stringify(userinfo)})
    } else {
        await mysql('cUser')
                .update({access_token, refresh_token, expires_in, unionid, user_info:JSON.stringify(userinfo)})
                .where({open_id:openid})
    }
}

module.exports = async (ctx) => {
    try {
        const {code} = ctx.request.body
        let authRes = await get(config.platform.user.accessTokenUrl,
            {
                appid: config.platform.appId,
                secret: config.platform.appSecret,
                code,
                grant_type: 'authorization_code'
            }
        )
        if (authRes.errcode) throw new Error(`authorization请求失败${JSON.stringify(authRes)}`)
        else {
            const {openid, access_token, refresh_token, expires_in} = authRes

            let userinfoRes = await get(config.platform.user.userinfoUrl, {
                access_token,
                openid,
                lang: 'zh_CN'
            })
            console.log(`获取${JSON.stringify(userinfoRes)}`)
            if (userinfoRes.errcode) throw new Error(`userinfo请求失败${JSON.stringify(userinfoRes)}`)
            else {
                const {unionid} = userinfoRes
                // 保存用戶信息
                await saveUserInfo(openid, access_token, refresh_token, expires_in, unionid, userinfoRes)
                ctx.state.data = {
                    userinfo: userinfoRes,
                    token: access_token
                }
            }
        }
    } catch (e) {
        console.log(e)
        ctx.state = {
            code: -1,
            data: {
                message: e.message
            }
        }
    }
}
