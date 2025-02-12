const express = require('express');
const router = express.Router();

// API 后端接口引入

// 加载 articles 路由文件
const ArticlesRouter = require('../routes/API/content/articles');
//加载 Category 路由文件
const CategoryRouter = require('../routes/API/content/Category');
//加载用户路由
const UserRouter = require('../routes/API/users/users');
//加载课程路由
const CoursesRouter = require('../routes/API/content/course');
// 添加章节路由
const ChapterRouter = require('../routes/API/content/chapters');
// 统计报表的路由
const ChartsRouter = require('../routes/API/content/charts');
// 后台账号登录
const AdminAuthRouter = require('../routes/API/users/auth');
//附件查询 删除
const getAttachmentRouter = require('../routes/API/content/attachments');
// 会员
const memberShipRouter = require('../routes/API/users/memberships');

// view 前端页面引入
const indexRouter = require('../routes/view');
const usersRouter = require('../routes/view/users/users');
const categoriesViewRouter = require('../routes/view/content/categoies');
const coursesViewRouter = require('../routes/view/content/courses');
const chaptersViewRouter = require('../routes/view/content/chapters');
const articlesViewRouter = require('../routes/view/content/articles');
const searchViewRouter = require('../routes/view/search');
const authViewRouter = require('../routes/view/users/auth');
const likesViewRouter = require('../routes/view/users/like');
const membershipsViewRouter = require('../routes/view/users/memberships');
const ordersViewRouter = require('../routes/view/users/orders');

// 公共接口

// 增加验证接口
const LoginAuth = require('../middleware/login-auth');
const userAuth = require('../middleware/user-auth');

//支付宝支付
const AlipayRouter = require('../routes/Pub/alipay');

//文件上传路由
const UploadFilesRouter = require('../routes/Pub/uploads');
// 清空缓存 flushAll flushdb
const clearCachesRouter = require('../routes/Pub/ClearCache');
// 图形验证码
const captchaRouter = require('../routes/Pub/captcha');

// 增加 Logger 日志路由
const loggerShowRouter = require('../routes/Pub/logs');

// view 页面接口
router.use('/', indexRouter);
router.use('/categories', categoriesViewRouter);
router.use('/courses', coursesViewRouter);
router.use('/chapters', userAuth, chaptersViewRouter); // 增加会员后，增加章节验证
router.use('/articles', articlesViewRouter);
router.use('/search', searchViewRouter);
router.use('/auth', authViewRouter);
router.use('/users', userAuth, usersRouter);
router.use('/likes', userAuth, likesViewRouter);
router.use('/member', membershipsViewRouter);
router.use('/orders', userAuth, ordersViewRouter);

// 公共部分路由
router.use('/UploadFiles', userAuth, UploadFilesRouter);
router.use('/cache', clearCachesRouter);
router.use('/captcha', captchaRouter);
router.use('/API/loggers', loggerShowRouter);
router.use('/alipay', AlipayRouter);

// API 后端接口
router.use('/API/articles', LoginAuth, ArticlesRouter);
router.use('/API/category', LoginAuth, CategoryRouter);
router.use('/API/user', LoginAuth, UserRouter);
router.use('/API/course', LoginAuth, CoursesRouter);
router.use('/API/chapter', LoginAuth, ChapterRouter);
router.use('/API/charts', LoginAuth, ChartsRouter);
router.use('/API/getAttachment', LoginAuth, getAttachmentRouter);
router.use('/API/member', LoginAuth, memberShipRouter);
// 登录路由 不能增加登录验证LoginAuth ，否则变成未登录前要验证登录了
router.use('/API/auth', AdminAuthRouter);

module.exports = router;
