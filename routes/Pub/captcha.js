const express = require('express');
const router = express.Router();
const { success, failure } = require('../../utils/responses');
const { setKey } = require('../../utils/redis');
const { v4: uuidv4 } = require('uuid');

const svgCaptcha = require('svg-captcha');

/**
 * 获得图形验证码
 */
router.get('/', async (req, res) => {
    try {
        // svgCaptcha.createMathExpr(...) 替换后生成数字验证码
        const captcha = svgCaptcha.create({
            size: 5,                    // 验证码长度
            ignoreChars: 'baijing112090oLliI',   // 验证码字符中排除 baijing112090oLliI
            noise: 2,                   // 干扰线条数量
            color: true,                // 是否有颜色，
            width: 100,                 // 宽
            height: 40                  // 高
        });

        // 生成唯一字串
        const captchaKey = `captcha:${uuidv4()}`;
        //验证码存入 redis
        await setKey(captchaKey, captcha.text, 60 * 10);


        //返回 captcha 数值
        success(res,'验证码获取成功',{
            captchaKey,
            captchaData: captcha.data
        });

        // 这是直接输出的代码，API接口要返回值
        // res.type('svg');
        // res.status(200).send(captcha.data);
    } catch (error) {

        failure(res, error);
    }
});

module.exports = router;
