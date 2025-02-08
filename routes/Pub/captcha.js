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

    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
