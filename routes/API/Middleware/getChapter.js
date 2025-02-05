const  express = require('express');
const { Chapter,Course } = require("../../../models")
const {NotfoundError} = require('../../../utils/errors')


function getCondition() {
    return {
        attributes: { exclude: ['CourseId'] },
        include: [
            {
                model: Course,
                as: 'course',
                attributes: ['id', 'name']
            }
        ]
    }
}




/**
 * 公共方法：查询数据
 */
async function getChapters(req) {
    //获取文章ID
    const {id} = req.params
    const condition = getCondition()

    const chapter = await Chapter.findByPk(id,condition)

    //没有找到文章， throw 异常
    if (!chapter) {
        throw new NotfoundError(`ID: ${id} 的文章未找到！！`)
    }

    return chapter
}

module.exports = {
    getChapters,
    getCondition
}