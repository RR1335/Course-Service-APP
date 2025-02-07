const  express = require('express');
const { User } = require("../../../models")
const {NotFound} = require('http-errors')
/**
 * 公共方法：查询数据
 */
async function getUser(req) {
    //获取文章ID
    const {id} = req.params

    const user = await User.findByPk(id)

    //没有找到文章， throw 异常
    if (!user) {
        throw new NotFound(`ID: ${id} 的用户名未找到！！`)
    }

    return user
}

module.exports = {
    getUser
}