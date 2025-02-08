const express = require('express');
const router = express.Router();
const { Course, Category, User } = require('../../models');
const { success, failure } = require('../../utils/responses');

const { setKey, getKey } = require('../../utils/redis');
const logger = require('../../utils/Logger')
/**
 * 首页查询结果
 */
router.get('/', async function (req, res, next) {
  try {
      throw new Error('测试 - 错误 - 提示')
    // redia 有数据直接读取
    let data = await getKey('index')
    if (data) {
      return success(res,'查询成功',data)
    }
      // 查询数据，无redis
      const [
        recommendedCourses,
        likesCourses,
        introductoryCourses
      ] = await Promise.all([
        Course.findAll({
          attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name']
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname', 'avatar', 'company'],
            }
          ],
          where: { recommended: true },
          order: [['id', 'desc']],
          limit: 10
        }),
        // 人气课程
        Course.findAll({
          attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
          order: [['likesCount', 'desc'], ['id', 'desc']],
          limit: 10
        }),

        // 入门课程
        Course.findAll({
          attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
          where: { introductory: true },
          order: [['id', 'desc']],
          limit: 10
        }),
      ])

    // 组合data的数据
    data = {
      recommendedCourses,
      likesCourses,
      introductoryCourses
    }

    // 设置缓存
    await setKey('index', data,100)

    success(res, '获取首页数据成功。',data);

  } catch (error) {
    logger.error(error);
    failure(res, error);
  }
});

module.exports = router;
