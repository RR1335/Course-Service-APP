const  express = require('express');
const { Article } = require("../../../models")
const {NotFound} = require('http-errors');
/**
 * 公共方法：查询数据
 */
async function getArticles(req) {
    //获取文章ID
    const {id} = req.params

    const article = await Article.findByPk(id)

    //没有找到文章， throw 异常
    if (!article) {
        throw new NotFound(`ID: ${id} 的文章未找到！！`)
    }

    return article
}

module.exports = {
    getArticles
}