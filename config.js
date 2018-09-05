const CONF = {
    port: '5757',
    rootPathname: '/wx',
    serverHost: 'www.pkfis.cn',

    signKey: 'test',
    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'bss',
        pass: 'weapp',
        char: 'utf8mb4'
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    // wxMessageToken: 'abcdefgh',
    // 微信小程序配置
    miniProgram: {
        // 微信小程序 App ID
        appId: 'wxed2da0fb9fff4b48',

        // 微信小程序 App Secret
        appSecret: '57fc45c50f9523cfa3b573764c25a94e'
    },
    mch: {
        mch_id: '1489646072',
        fee_type: 'CNY',
        notify_url: 'http://www.pkfis.cn/wx/notify',
        limit_pay: '',
        mch_expire: '30',
        unifiedorderUrl: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        sign_key: 'a5cfcc192e86054822b2a24ac89ebf5d'
    },
    // 公众平台配置
    platform: {
        // 微信公众号 App ID
        appId: 'wxfbb29b02f3f076b8',
        // 微信公众号 App Secret
        appSecret: 'a5cfcc192e86054822b2a24ac89ebf5d',
        accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
        serverToken: 'vjiatech',
        user: {
            authorizationUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token',
            userinfoUrl: 'https://api.weixin.qq.com/sns/userinfo'
        }
    }
}

module.exports = CONF
