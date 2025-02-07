
const createError = require('http-errors');
const multer = require('multer');

/**
 * 自定义 404 错误
 */
// class NotFound extends Error {
//     constructor(message) {
//         super(message)
//         this.name = 'NotFound'
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
 * 请求失败的情况
 * @param res
 * @param error
 */
function failure(res, error) {
    // 默认响应为 500，服务器错误
    let statusCode = 500;
    let errors = '服务器错误';

    if (error.name === 'SequelizeValidationError') {  // Sequelize 验证错误
        statusCode = 400;
        errors = error.errors.map(e => e.message);
    } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {  // Token 验证错误
        statusCode = 401;
        errors = '您提交的 token 错误或已过期。';
    } else if (error instanceof createError.HttpError) {  // http-errors 库创建的错误
        statusCode = error.status;
        errors = error.message;
    }else if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            statusCode = 413;
            errors = '文件大小超出限制。';
        } else {
            statusCode = 400;
            errors = error.message;
        }
    }

    res.status(statusCode).json({
        status: false,
        message: `请求失败: ${error.name}`,
        errors: Array.isArray(errors) ? errors : [errors]
    });
}







// function failure(res,error) {
//     if (error.name === 'SequelizeValidationError') {
//         const errors = error.errors.map(error => error.message)
//
//     if (error.name === 'BadRequest') {
//         return res.status(400).json({
//             status: false,
//             message: '请求参数错误',
//             errors: [error.message]
//         });
//     }
//
//     if (error.name === 'Unauthorized') {
//         return res.status(401).json({
//             status: false,
//             message: '认证失败',
//             errors: [error.message]
//         });
//     }
//
//    res.status(400).json({
//             status: false,
//             message: '请求参数错误，请重新设置',
//             errors
//         })
//     }
//
//     res.status(500).json({
//         status: false,
//         message:'服务器错误 ！！！',
//         errors: [error.message]
//     })
//
//     if (error.name === 'JsonWebTokenError') {
//         return res.status(401).json({
//             status: false,
//             message: '认证失败',
//             errors: ['您提交的 token 错误。']
//         });
//     }
//
//     if (error.name === 'TokenExpiredError') {
//         return res.status(401).json({
//             status: false,
//             message: '认证失败',
//             errors: ['您的 token 已过期。']
//         });
//     }
//
// }



module.exports = {
    success,
    failure
}