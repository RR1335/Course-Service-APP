const express = require('express');
const router = express.Router();
const { User } = require('../../../models');
const { success, failure } = require('../../../utils/responses');
const { BadRequest, NotFound } = require('http-errors');
const bcrypt = require('bcryptjs');
const { getUser } = require('../../../middleware/getuser');

const { setKey, getKey, delKey } = require('../../../utils/redis');

/**
 * 查看用户信息，登录后
 */
router.get('/userinfo', async function (req, res) {
   try {
      let user = await getKey(`user:${req.userId}`);
      if (!user) {
         user = await getUser(req);
         // 写入 redis
         await setKey(`user:${req.userId}`, user);
      }

      success(res, '查询当前用户信息成功。', { user });
   } catch (error) {
      failure(res, error);
   }
});

/**
 * 更新用户信息
 */
router.put('/updateuserinfo', async function (req, res) {
   try {
      const body = {
         nickname: req.body.nickname,
         sex: req.body.sex,
         company: req.body.company,
         introduce: req.body.introduce,
         avatar: req.body.avatar,
      };

      const user = await getUser(req);
      await user.update(body);
      // 清空缓存
      await clearCache(user);
      success(res, '更新用户信息成功。', { user });
   } catch (error) {
      failure(res, error);
   }
});

/**
 * 更新账号信息
 */
router.put('/userdata', async function (req, res) {
   try {
      const body = {
         email: req.body.email,
         username: req.body.username,
         currentPassword: req.body.currentPassword,
         password: req.body.password,
         passwordConfirmation: req.body.passwordConfirmation,
      };

      if (!body.currentPassword) {
         throw new BadRequest('当前密码必须填写。');
      }

      if (body.password !== body.passwordConfirmation) {
         throw new BadRequest('两次输入的密码不一致。');
      }

      // 加上 true 参数，可以查询到加密后的密码
      const user = await getUser(req, true);

      // 验证当前密码是否正确
      const isPasswordValid = bcrypt.compareSync(body.currentPassword, user.password);
      if (!isPasswordValid) {
         throw new BadRequest('当前密码不正确。');
      }

      await user.update(body);

      // 删除密码
      delete user.dataValues.password;
      // 清空缓存
      await clearCache(user);
      success(res, '更新账户信息成功。', { user });
   } catch (error) {
      failure(res, error);
   }
});

async function clearCache(user) {
   await delKey(`user:${user.id}`);
}

module.exports = router;
