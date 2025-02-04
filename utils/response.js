
/**
 * 自定义 404 错误
 */
class NotfoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'NotfoundError'
    }
}

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

        res.status(400).json({
            status: false,
            message: '请求参数错误，请重新设置',
            errors
        })
    }

    if (error.name === 'NotFoundError') {
        res.status(404).json({
            status: false,
            message:'数据不存在 ～～～',
            errors:[error.message]
        })
    }

    res.status(500).json({
        status: false,
        message:'服务器错误 ！！！',
        errors: [error.message]
    })

}



module.exports = {
    NotfoundError,
    success,
    failure
}