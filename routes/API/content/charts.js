const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../../../models');
const { Op } = require('sequelize');
const {
    success,
    failure
} = require('../../../utils/responses');


/**
 * 根据用户统计性别
 */
router.get('/sex', async function (req, res) {
    try {
        const [male, female, unknown] = await Promise.all([
            User.count({ where: { sex: 0 } }),
            User.count({ where: { sex: 1 } }),
            User.count({ where: { sex: 2 } })
        ]);

        const data = [
            { value: male, name: '男性' },
            { value: female, name: '女性' },
            { value: unknown, name: '未选择' }
        ];

        success(res, '查询用户性别成功。', { data });
    } catch (error) {
        failure(res, error);
    }
});



router.get('/user', async (req, res) => {
    try {
        const [results] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC");

        const data = {
            months: [],
            values: [],
        };

        results.forEach(item => {
            data.months.push(item.month);
            data.values.push(item.value);
        });

        success(res, '查询每月用户数量成功。', { data });
    } catch (error) {
        failure(res, error);
    }
});



module.exports = router;
