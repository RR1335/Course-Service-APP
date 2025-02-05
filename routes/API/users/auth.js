const express = require('express');
const router = express.Router();
const { User } = require('../../../models');
const { Op } = require('sequelize');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../../../utils/errors');
const { success, failure } = require('../../../utils/responses');

/**
 * 登录 账号 Admin
 */
router.post('/login', async (req, res) => {
    try {
        const { login , password } = req.body;

        if (!login) {
            throw  new BadRequestError('Email/UserName 必填')
        }

        if (!password) {
            throw new BadRequestError('PassWord 必填')
        }

        const condition = {
            where: {
                [Op.or]: [                 // Op.or 或
                    {
                        email: login,
                    },
                    {
                        username: login,
                    }
                ]
            }
        }

        const user = await  User.findOne(condition)
        if (!user) {
            throw new NotFoundError('用户不存在，请重新输入；或 注册')
        }

        success(res, '登录成功。', {});
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
