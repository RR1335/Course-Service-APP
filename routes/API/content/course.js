const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { Course, Category, User, Chapter } = require('../../../models');
const { kfilterBody } = require('../Middleware/kfilter');
const { getCourse, getCondition } = require('../Middleware/getcourse');
const { success, failure } = require('../../../utils/responses');
const { Conflict } = require('http-errors');
const { courseClearCache } = require('../Middleware/courseClearCache');

/**
 * 查询 全部课程
 */
router.get('/', async function (req, res) {
   try {
      const query = req.query;

      // 通过前端定义，获取分页数据
      const currentPage = Math.abs(Number(query.currentPage)) || 1;
      const pageSize = Math.abs(Number(query.pageSize)) || 10;

      const offset = (currentPage - 1) * pageSize;

      const condition = {
         ...getCondition(),
         where: {},
         order: [['id', 'DESC']],
         limit: pageSize,
         offset: offset,
      };

      if (query.categoryId) {
         condition.where.categoryId = query.categoryId;
      }

      if (query.userId) {
         condition.where.userId = query.userId;
      }

      if (query.name) {
         condition.where.name = {
            [Op.like]: `%${query.name}%`,
         };
      }

      if (query.recommended) {
         condition.where.recommended = {
            // 需要转布尔值
            [Op.eq]: query.recommended === 'true',
         };
      }

      if (query.introductory) {
         condition.where.introductory = {
            [Op.eq]: query.introductory === 'true',
         };
      }

      // 通过异步获取数据
      const { count, rows } = await Course.findAndCountAll(condition);

      res.json({
         status: true,
         message: '查询成功',
         data: {
            courses: rows,
            pagination: {
               total: count,
               currentPage: currentPage,
               pageSize: pageSize,
            },
         },
      });
   } catch (err) {
      failure(res, err);
   }
});

/**
 * 查询特定课程
 */
router.get('/:id', async function (req, res) {
   try {
      const course = await getCourse(req);

      success(res, '查询课程，成功！', { course });
   } catch (err) {
      failure(res, err);
   }
});

/**
 * 新增课程
 */
router.post('/', async function (req, res) {
   try {
      const body = kfilterBody(req);

      // 获取当前用户的ID
      body.userId = req.user.id;

      const course = await Course.create(body);

      // 清空缓存
      await courseClearCache();
      success(res, '新增课程，成功！', { course }, 201);
   } catch (err) {
      failure(res, err);
   }
});

/**
 * 删除课程
 */
router.delete('/:id', async function (req, res) {
   try {
      const course = await getCourse(req);

      // 无关联数据再删除
      const count = await Chapter.count({ where: { courseId: req.params.id } });
      if (count > 0) {
         throw new Conflict('当前课程有章节，无法删除。');
      }

      await course.destroy();

      // 清空缓存
      await courseClearCache(course);
      success(res, '删除课程，成功！');
   } catch (err) {
      failure(res, err);
   }
});

/**
 * 更新课程
 */
router.put('/:id', async function (req, res) {
   try {
      const course = await getCourse(req);

      const body = kfilterBody(req);
      await course.update(body);

      // 清空缓存
      await courseClearCache(course);
      success(res, '更新课程，成功！', { course });
   } catch (err) {
      failure(res, err);
   }
});

module.exports = router;
