const  express = require('express');
const { Course,Category,User } = require("../../../models")
const {NotfoundError} = require('../../../utils/response')


function getCondition() {
    return  {
        attributes: { exclude: ['CategoryId', 'UserId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ]
    }

}




/**
 * 公共方法：查询数据
 */
async function getCourse(req) {
    const { id } = req.params;

    const  condition = getCondition()

    const course = await Course.findByPk(id, condition);
    if (!course) {
        throw new NotfoundError(`ID: ${ id }的课程未找到。`)
    }

    return course;
}

module.exports = {
    getCourse,
    getCondition
}