const http = require('axios')
const config = require('../config')
module.exports = async (ctx) => {
    try {
        const {code} = ctx.request.body
        let authRes = await http({
            method: 'get',
            url: config.platform.user.authorizationUrl,
            params: {
                appid: config.platform.appId,
                secret: config.platform.appSecret,
                code,
                grant_type: 'authorization_code'
            }
        })
        authRes = authRes.data
        console.log(`获取${JSON.stringify(authRes)}`)
        if (authRes.errcode) throw new Error(`authorization请求失败${JSON.stringify(authRes)}`)
        else {
            const {openid, access_token} = authRes
            let userinfoRes = await http({
                method: 'get',
                url: config.platform.user.userinfoUrl,
                params: {
                    access_token,
                    openid,
                    lang: 'zh_CN'
                }
            })
            userinfoRes = userinfoRes.data
            console.log(`获取${JSON.stringify(userinfoRes)}`)
            if (userinfoRes.errcode) throw new Error(`userinfo请求失败${JSON.stringify(userinfoRes)}`)
            ctx.stat = {
                code: 1,
                data: Object.assign({}, userinfoRes, {
                    access_token
                })
            }
        }
    } catch (e) {
        console.log(e)
    }
}
