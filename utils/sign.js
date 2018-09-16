const crypto = require('crypto')

/**
 * 加密
 * @param {Object} obj 需要加密的对象
 * @param {Boolean} sort 是否排序
 */
const sign = (obj, sort) => {
    const sha1 = crypto.createHash('sha1')
    const arr = Object.keys(obj)
    if (sort) arr.sort()
    let sha1String = ''
    for (let index = 0; index < arr.length; index++) {
        sha1String += `${arr[index]}=${obj[arr[index]]}`
        if (index < arr.length - 1) sha1String += '&'
    }
    return sha1.update(sha1String).digest('hex')
}

module.exports = {
    sign
}
