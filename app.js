const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
// const logger = require('morgan')
// 环境变量的处理 很重要
require('dotenv').config();

// 引入跨域的 CORS
const cors = require('cors')

// API 后端接口引入

// 加载 articles 路由文件
const ArticlesRouter = require('./routes/API/content/articles')
//加载 Category 路由文件
const CategoryRouter = require('./routes/API/content/Category')
//加载用户路由
const UserRouter = require('./routes/API/users/users')
//加载课程路由
const CoursesRouter = require('./routes/API/content/course')
// 添加章节路由
const ChapterRouter = require('./routes/API/content/chapters')
// 统计报表的路由
const  ChartsRouter = require('./routes/API/content/charts')
// 后台账号登录
const  AdminAuthRouter = require('./routes/API/users/auth')
//附件查询 删除
const getAttachmentRouter = require('./routes/API/content/attachments')
// 会员
const memberShipRouter = require('./routes/API/users/memberships')

// view 前端页面引入
const indexRouter = require('./routes/view')
const usersRouter = require('./routes/view/users/users')
const categoriesViewRouter = require('./routes/view/content/categoies')
const coursesViewRouter = require('./routes/view/content/courses')
const chaptersViewRouter = require('./routes/view/content/chapters')
const articlesViewRouter = require('./routes/view/content/articles')
const searchViewRouter = require('./routes/view/search')
const authViewRouter = require('./routes/view/users/auth')
const likesViewRouter = require('./routes/view/users/like')
const membershipsViewRouter = require('./routes/view/users/memberships')
const ordersViewRouter = require('./routes/view/users/orders')

// 公共接口

// 增加验证接口
const LoginAuth = require('./middleware/login-auth')
const userAuth = require('./middleware/user-auth')

//支付宝支付
const AlipayRouter = require('./routes/Pub/alipay')

//文件上传路由
const UploadFilesRouter = require('./routes/Pub/uploads')
// 清空缓存 flushAll flushdb
const clearCachesRouter = require('./routes/Pub/ClearCache')
// 图形验证码
const captchaRouter = require('./routes/Pub/captcha')
//引入定时任务
// const schedule = require('node-schedule');
//引入定时任务
const initScheduleTasks = require('./middleware/task/indextask');
// 增加 Logger 日志路由
const loggerShowRouter = require('./routes/Pub/logs')
// 启动邮件消费者
const { mailConsumer } = require('./utils/rabbitmqconn');
(async () => {
    await mailConsumer();
    // console.log('邮件消费者已启动');
})();


// 定时任务执行
// const job = schedule.scheduleJob('* * * * * *', function(){
//     console.log('baijing.biz 白鲸，最好！');
// });
initScheduleTasks();


const app = express()

// app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))



const corsOptions = {
    origin: [
        'http://localhost:63342',
        'http://baijing.biz'
    ],
}

// app.use(cors()) 必须在路由前配置
app.use(cors(corsOptions));




// view 页面接口
app.use('/', indexRouter)
app.use('/categories', categoriesViewRouter)
app.use('/courses', coursesViewRouter)
app.use('/chapters',userAuth, chaptersViewRouter)        // 增加会员后，增加章节验证
app.use('/articles', articlesViewRouter)
app.use('/search', searchViewRouter)
app.use('/auth',authViewRouter)
app.use('/users',userAuth, usersRouter)
app.use('/likes',userAuth, likesViewRouter)
app.use('/member',membershipsViewRouter)
app.use('/orders',userAuth,ordersViewRouter)

// 公共部分路由
app.use('/UploadFiles',userAuth,UploadFilesRouter)
app.use('/cache',clearCachesRouter)
app.use('/captcha',captchaRouter)
app.use('/API/loggers',loggerShowRouter)
app.use('/alipay',AlipayRouter)


// API 后端接口
app.use('/API/articles',LoginAuth, ArticlesRouter)
app.use('/API/category',LoginAuth, CategoryRouter)
app.use('/API/user',LoginAuth, UserRouter)
app.use('/API/course',LoginAuth, CoursesRouter)
app.use('/API/chapter',LoginAuth, ChapterRouter)
app.use('/API/charts',LoginAuth, ChartsRouter)
app.use('/API/getAttachment',LoginAuth,getAttachmentRouter)
app.use('/API/member',LoginAuth,memberShipRouter)
// 登录路由 不能增加登录验证LoginAuth ，否则变成未登录前要验证登录了
app.use('/API/auth', AdminAuthRouter)

module.exports = app
