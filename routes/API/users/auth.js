const express = require('express');
const router = express.Router();
const { User } = require('../../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const {JWTCODE} = require('../../../config/constants');

const { BadRequest, Unauthorized, NotFound } = require('http-errors');
const { success, failure } = require('../../../utils/responses');


/**
 * 登录 账号 Admin
 */
router.post('/login', async (req, res) => {
    try {
        const { login , password } = req.body;

        if (!login) {
            throw  new BadRequest('Email/UserName 必填')
        }

        if (!password) {
            throw new BadRequest('PassWord 必填')
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
            throw new NotFound('用户不存在，请重新输入；或 注册')
        }

        // 验证密码是否正确
        const isPasswordValid = bcrypt.compareSync(password, user.password);  // bcryptjs 提供的比对方法
        if (!isPasswordValid) {
            throw new Unauthorized('密码错误。');
        }

        // 验证是否管理员
        if (user.role !== 100) {
            throw new Unauthorized('您没有权限登录管理员后台。');
        }

        // 生成身份验证令牌
        const token = jwt.sign({
                userId: user.id
            }, process.env.SECRET, { expiresIn: '30d' }
        );
        success(res, '登录成功。', { token });
        // success(res, '登录成功。', {});
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
