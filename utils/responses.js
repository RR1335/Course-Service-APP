const  {  } = require('../utils/errors')

/**
 * 自定义 404 错误
 */
// class NotfoundError extends Error {
//     constructor(message) {
//         super(message)
//         this.name = 'NotfoundError'
//     }
// }

/**
 * 成功提示信息
 * @param res
 * @param message
 * @param data
 * @param code      代码，默认 200
 */
function success(res,message,data = {}, code = 200) {
    res.status(code).json({
        status: true,
        message,
        data
    })
}

/**
 * 请求错误提示
 * @param res
 * @param error
 */
function failure(res,error) {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(error => error.message)

    if (error.name === 'BadRequestError') {
        return res.status(400).json({
            status: false,
            message: '请求参数错误',
            errors: [error.message]
        });
    }

    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            errors: [error.message]
        });
    }

   res.status(400).json({
            status: false,
            message: '请求参数错误，请重新设置',
            errors
        })
    }

    res.status(500).json({
        status: false,
        message:'服务器错误 ！！！',
        errors: [error.message]
    })

    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            errors: ['您提交的 token 错误。']
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            errors: ['您的 token 已过期。']
        });
    }

}



module.exports = {
    success,
    failure
}