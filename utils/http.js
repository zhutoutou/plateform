const axios = require('axios')
const get = (url, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const httpRes = await axios({
                method: 'get',
                url: url,
                params: params
            })
            resolve(httpRes.data)
        } catch (err) {
            reject(err)
        }
    })
}

const post = (url, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const httpRes = await axios({
                method: 'post',
                url: url,
                data: data
            })
            resolve(httpRes.data)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    get,
    post
}
