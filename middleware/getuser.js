const {User} = require('../models');
const {NotFound} = require('http-errors')

/**
 * 查询当前用户信息
 * @param req
 * @returns {Promise<void>}
 */
async function getUser(req, showPassword = false) {
    const id = req.userId;

    let condition = {};
    if (!showPassword) {
        condition = {
            attributes: { exclude: ['password'] },
        };
    }

    const user = await User.findByPk(id, condition);
    if (!user) {
        throw new NotFound(`ID: ${ id }的用户未找到。`)
    }

    return user;
}


module.exports = {
    getUser
}