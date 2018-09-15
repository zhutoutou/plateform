module.exports = {
    ERRORS: {
        // 初始化错误
        ERR_WHEN_INIT_SDK: 'ERR_WHEN_INIT_SDK',                     // 初始化出现问题
        ERR_INIT_SDK_LOST_CONFIG: 'ERR_INIT_SDK_LOST_CONFIG',       // 配置文件缺失
        ERR_ACCESS_TOKEN_UNFOUND: 'ERR_ACCESS_TOKEN_UNFOUND',       // 找不到AccessToken说明accessToken获取流程有问题
        ERR_JSAPI_TICKET_UNFOUND: 'ERR_JSAPI_TICKET_UNFOUND',       // 找不到jsapiTicket说明jsapiTicket获取流程有问题
        // 获取access_Token
        ERR_GET_ACCESS_TOKEN: 'ERR_GET_ACCESS_TOKEN',               // 获取accessToken的接口存在问题
        ERR_GET_JSAPI_TICKET: 'ERR_GET_JSAPI_TICKET'                // 获取jsapiTicket的接口存在问题

    },
    ACCESS_TOKEN: undefined,
    JSAPI_TICKET: undefined
    // set: (key, value) => {
    //     this[key] = value
    // },
    // get: (key) => {
    //     return this[key]
    // }
}
