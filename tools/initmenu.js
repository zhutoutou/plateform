const {menuCreate} = require('../api/wechat')
const config = require('../config')

console.log('\n======================================')
console.log('开始更新菜单...')

menuCreate(config.platform.menu)
.then(res => {
    if (res) console.log('菜单更新成功')
}).catch(err => {
    console.log(err)
})
