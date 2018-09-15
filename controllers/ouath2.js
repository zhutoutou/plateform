const url = require('url')
const {platform: {appId, user: {authorizeUrl, authorizeRedirectUrl, response_type, scope}}} = require('../config')
module.exports = ctx => {
    const { state } = ctx.request.body
    if (!authorizeRedirectUrl || !authorizeUrl) {
        throw new Error(`未配置公众号授权的地址`)
    } else {
        const query = {
            appid: appId,
            redirect_uri: authorizeRedirectUrl,
            response_type,
            scope,
            state
        }
        const hash = '#wechat_redirect'
        const originUrl = url.parse(authorizeUrl)
        let urlString = url.format({
            protocol: originUrl.protocol,
            host: originUrl.host,
            pathname: originUrl.pathname,
            query,
            hash
        })
        ctx.state.data = urlString
    }
}
