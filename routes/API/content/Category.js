const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { Category, Course } = require('../../../models');
const { cfilerBody } = require('../Middleware/Cfilter');
const { getCategory } = require('../Middleware/getcategory');
const { success, failure } = require('../../../utils/responses');
const { Conflict } = require('http-errors');
const { categroyClearCache } = require('../Middleware/categroyclearcache');

/**
 * 查询分类 All
 */
router.get('/', async function (req, res) {
   try {
      const query = req.query;

      const condition = {
         where: {},
         order: [
            ['rank', 'ASC'],
            ['id', 'ASC'],
         ],
      };

      if (query.name) {
         condition.where.name = {
            [Op.like]: `%${query.name}%`,
         };
      }

      const categories = await Category.findAll(condition);
      success(res, '查询分类列表成功。', {
         categories: categories,
      });
   } catch (error) {
      failure(res, error);
   }
});

/**
 * 查询特定分类
 */
router.get('/:id', async function (req, res) {
   try {
      const category = await getCategory(req);

      success(res, '查询分类，成功！', { category });
   } catch (err) {
      failure(res, err);
   }
});

/**
 * 新增分类
 */
router.post('/', async function (req, res) {
   try {
      const body = cfilerBody(req);

      const category = await Category.create(body);

      // 清空当前缓存
      await categroyClearCache();
      success(res, '新增分类，成功！', { category }, 201);
   } catch (err) {
      failure(res, err);
   }
});

/**
 * 删除分类
 */
router.delete('/:id', async function (req, res) {
   try {
      const category = await getCategory(req);

      // 判断是否有关联的课程，有则终止删除
      const count = await Course.count({ where: { categoryId: req.params.id } });
      if (count > 0) {
         throw new Conflict('当前分类有课程，无法删除。');
      }

      await category.destroy();
      // 清空当前缓存
      await categroyClearCache(category);
      success(res, '删除分类，成功！');
   } catch (err) {
      failure(res, err);
   }
});

/**
 * 更新分类
 */
router.put('/:id', async function (req, res) {
   try {
      const category = await getCategory(req);

      const body = cfilerBody(req);
      await category.update(body);
      // 清空当前缓存
      await categroyClearCache(category);

      success(res, '更新分类，成功！', { category });
   } catch (err) {
      failure(res, err);
   }
});

module.exports = router;
