const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
// 环境变量的处理
require('dotenv').config();

// 增加验证接口
const LoginAuth = require('./middleware/login-auth')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
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


const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/API/articles',LoginAuth, ArticlesRouter)
app.use('/API/category',LoginAuth, CategoryRouter)
app.use('/API/user',LoginAuth, UserRouter)
app.use('/API/course',LoginAuth, CoursesRouter)
app.use('/API/chapter',LoginAuth, ChapterRouter)
app.use('/API/charts',LoginAuth, ChartsRouter)
// 登录路由 不能增加登录验证LoginAuth ，否则变成未登录前要验证登录了
app.use('/API/auth', AdminAuthRouter)

module.exports = app
