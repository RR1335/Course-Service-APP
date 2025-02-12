const express = require('express');
const router = express.Router();
const { Category } = require('../../../models');
const { success, failure } = require('../../../utils/responses');
const { setKey, getKey } = require('../../../utils/redis');

/**
 * 分类查询结构
 */
router.get('/', async function (req, res, next) {
   try {
      // 获取缓存数据
      let categories = await getKey('categories');
      //判断缓存是否有数据 key
      if (!categories) {
         // 第一次查询数据，去数据库查询
         categories = await Category.findAll({
            order: [
               ['rank', 'ASC'],
               ['id', 'DESC'],
            ],
         });
         // 将数据缓存到 redis
         await setKey('categories', categories);
      }

      success(res, '查询分类成功。', { categories });
   } catch (error) {
      failure(res, error);
   }
});

module.exports = router;
