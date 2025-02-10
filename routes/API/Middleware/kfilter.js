const  express = require("express")

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: *, name, introductory: (boolean|*), userId: (number|*), categoryId: (number|*), content, recommended: (boolean|*)}}
 */
function kfilterBody(req) {
    return {
        categoryId: req.body.categoryId,
        // 通过 req.user.id 获取当前登录用户ID
        // userId: req.body.userId,
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content,
        free: req.body.free
    };
}

module.exports = {
    kfilterBody
}