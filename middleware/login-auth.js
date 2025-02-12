const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Unauthorized } = require('http-errors');
const { success, failure } = require('../utils/responses');
// const {JWTCODE} = require('../config/constants')

module.exports = async (req, res, next) => {
   try {
      // 判断 Token 是否存在
      const { token } = req.headers; // token 通常存在 headers 中
      if (!token) {
         throw new Unauthorized('当前接口需要认证才能访问。');
      }

      // 验证 token 是否正确
      const decoded = jwt.verify(token, process.env.SECRET);
      // const decoded = await jwt.verify(token, JWTCODE);
      // 从 jwt 中，解析出之前存入的 userId
      const { userId } = decoded;

      // 查询一下，当前用户
      const user = await User.findByPk(userId);
      if (!user) {
         throw new Unauthorized('用户不存在。');
      }

      // 验证当前用户是否是管理员
      if (user.role !== 100) {
         throw new Unauthorized('您没有权限使用当前接口。');
      }

      // 登录后，路由获取的当前用户信息，为 req.user
      req.user = user;

      next();
   } catch (error) {
      failure(res, error);
   }
};
