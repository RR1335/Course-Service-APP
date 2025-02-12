const schedule = require('node-schedule');
const { Op } = require('sequelize');
const moment = require('moment');
const { sequelize, Order } = require('../../models');
const logger = require('../../utils/Logger');

/**
 * 定时检查并处理超时未支付订单
 * 每天凌晨 4:30 执行一次
 */
function scheduleOrderCheck() {
   // 凌晨的 4:30分，第一个 0 可以省略（秒可选）
   schedule.scheduleJob('0 30 4 * * *', async () => {
      const t = await sequelize.transaction();

      try {
         // 查找超时未支付的订单
         const expiredOrders = await Order.findAll({
            attributes: ['id'],
            where: {
               status: 0,
               createdAt: {
                  [Op.lt]: moment().subtract(1, 'day').toDate(),
               },
            },
            transaction: t,
            lock: true, // 使用排它锁，防止并发更新
         });

         // 已超时订单的 ID 列表
         const orderIds = expiredOrders.map((order) => order.id);

         // 批量更新超时订单状态
         await Order.update(
            {
               status: 2, // 订单状态：已取消（超时）
            },
            {
               where: {
                  id: orderIds,
               },
               transaction: t,
            }
         );

         await t.commit();
      } catch (error) {
         await t.rollback();
         logger.error('定时任务处理超时订单失败：', error);
      }
   });
}

module.exports = scheduleOrderCheck;
