const  express = require('express');
const { Category,Course } = require("../../../models")
const {NotFound} = require('http-errors')
/**
 * 公共方法：查询数据
 */
async function getCategory(req) {
    //获取文章ID
    const {id} = req.params

    // const condition = {
    //     include: [
    //         {
    //             model: Course,
    //             as: 'courses',
    //         },
    //     ]
    // }

    const category = await Category.findByPk(id)

    //没有找到文章， throw 异常
    if (!category) {
        throw new NotFound(`ID: ${id} 的分类未找到！！`)
    }

    return category
}

module.exports = {
    getCategory
}