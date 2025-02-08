const express = require('express');
const router = express.Router();
const { User } = require('../../../models');
const { success, failure } = require('../../../utils/responses');
const { NotFound, BadRequest, Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const captchaverify = require('../../../middleware/captchaverify')
const { delKey} = require('../../../utils/redis')
const { sendMail } = require('../../../utils/mailser')

/**
 * 用户注册
 */
router.post('/usersignup',captchaverify,async function (req, res) {
    try {
        const body = {
            email: req.body.email,
            username: req.body.username,
            nickname: req.body.nickname,
            password: req.body.password,
            sex: 2,                         // 默认性别保密
            role: 0                         // 用户注册默认 role 为 0
        }

        const user = await User.create(body);
        delete user.dataValues.password; // 返回结果中删除 密码

        await  delKey(req.body.captchaKey)

        // 发注册成功的邮件
        const html = `
                  您好，<span style="color: Blue">${user.nickname}。</span><br><br>
                  恭喜，您已成功注册baijing.biz的会员！<br><br>
                  请访问<a href="https://baijing.biz">白鲸</a>的官网，了解更多。<br><br>
        ` // 邮件内容结束

        // 发送邮件
        await sendMail(user.email, '成功注册「baijing.biz」，成为会员', html);

        success(res, '创建用户成功。', { user }, 201);
    } catch (error) {
        console.log(error);
        failure(res, error);
    }
});

/**
 * 用户登录
 */
router.post('/userlogin', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login) {
            throw new BadRequest('邮箱/用户名必须填写。');
        }

        if (!password) {
            throw new BadRequest('密码必须填写。');
        }

        const condition = {
            where: {
                [Op.or]: [
                    { email: login },
                    { username: login }
                ]
            }
        };

        // 通过email或username，查询用户是否存在
        const user = await User.findOne(condition);
        if (!user) {
            throw new NotFound('用户不存在，无法登录。');
        }

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            throw new Unauthorized('密码错误。');
        }

        // 生成身份验证令牌
        const token = jwt.sign({
                userId: user.id
            }, process.env.SECRET, { expiresIn: '30d' }
        );
        success(res, '登录成功。', { token });
    } catch (error) {
        failure(res, error);
    }
});


module.exports = router;
