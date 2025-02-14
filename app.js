const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 引入跨域的 CORS
const cors = require('cors');
// 环境变量的处理 很重要
require('dotenv').config();

// 启动邮件消费者
const { mailConsumer } = require('./utils/rabbitmqconn');
(async () => {
   await mailConsumer();
   // console.log('邮件消费者已启动');
})();

//引入定时任务
const initScheduleTasks = require('./middleware/task/indextask');
initScheduleTasks();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
   origin: ['http://localhost:63342',
      'http://baijing.biz'],
};

// app.use(cors()) 必须在路由前配置
app.use(cors(corsOptions));

const routes = require('./config/routers');
app.use(routes);

module.exports = app;
