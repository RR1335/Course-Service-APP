const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
// 加载 articles 路由文件
const ArticlesRouter = require('./routes/API/content/articles')
//加载 Category 路由文件
const CategoryRouter = require('./routes/API/content/Category')
//加载用户路由
const UserRouter = require('./routes/API/content/users')
//加载课程路由
const CoursesRouter = require('./routes/API/content/course')


const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/API/articles', ArticlesRouter)
app.use('/API/category', CategoryRouter)
app.use('/API/user', UserRouter)
app.use('/API/course', CoursesRouter)

module.exports = app
