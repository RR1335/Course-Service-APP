const winston = require('winston');

const logger = winston.createLogger({
    //
    // level 表示日志的级别，例如，info、warn、error等，默认为info，低于info的日志不会输出，
    // 可以通过设置level来调整日志的级别，例如，设置为warn，则只会输出warn、error级别的日志，不会输出info级别的日志。
    //
    level: 'info',
    //
    // format 表示日志的格式，例如，json格式
    //
    // format: winston.format.json(),
    format: winston.format.combine(
        winston.format.errors({ stack: true }),    // 添加错误堆栈信息
        winston.format.json()
    ),
    //
    // defaultMeta 表示 添加一些元数据，例如服务名称，到日志中
    //
    defaultMeta: { service: 'BaiJing-BIZ-API' },
    //
    // transports 表示日志的输出位置。可以添加多个，例如将日志输出到文件、数据库等位置。
    //
    transports: [
        //
        // 将 `error` 或 更高级别的错误写入日志文件：`error.log`
        // （即，error、fatal，但不包括其他级别）
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        //
        //  将 `info` 或 更高级别的错误写入日志文件：`combined.log`
        // （即，fatal、error、warn、info 和 debug，但不包括 trace）
        //
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// 非生成环境，给输出的日志增加颜色 —— 终端
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),                    // 终端中输出彩色的日志信息
            winston.format.simple()
        )
    }));
}


//
// 如果不是生产环境，则在终端中用以下格式输出，这样便于调试错误
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.simple(),
//     }));
// }

module.exports = logger;
