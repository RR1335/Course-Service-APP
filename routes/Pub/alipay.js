const express = require('express')
const router = express.Router()
const {sequelize, User, Order } = require('../../models');
const { success, failure } = require('../../utils/responses');
const { NotFound, BadRequest } = require('http-errors');
const alipaySdk = require('../../utils/alipay');
const userAuth = require('../../middleware/user-auth');
const moment = require('moment');
const logger = require('../../utils/Logger');



/**
 * 支付宝支付 —— 跳转支付宝支付页面的方式支付
 * POST /alipay/pay/page    电脑页面
 * POST /alipay/pay/wap     手机页面
 */
router.post('/pay/:platform', userAuth, async function (req, res, next) {
    try {
        // 判断是电脑页面，还是手机页面
        const isPC = req.params.platform === 'page';
        const method = isPC ? 'alipay.trade.page.pay' : 'alipay.trade.wap.pay';
        const productCode = isPC ? 'FAST_INSTANT_TRADE_PAY' : 'QUICK_WAP_WAY';

        // 支付订单信息
        const order = await getOrder(req);
        const { outTradeNo, totalAmount, subject } = order;
        const bizContent = {
            product_code: productCode,
            out_trade_no: outTradeNo,
            subject: subject,
            total_amount: totalAmount
        };

        // 支付页面接口，返回 HTML 代码片段
        const url = alipaySdk.pageExecute(method, 'GET', {
            bizContent,
            returnUrl: process.env.ALIPAY_RETURN_URL,   // 当支付完成后，支付宝跳转地址
            notify_url: process.env.ALIPAY_NOTIFY_URL,    // 异步通知接口地址
        });

        success(res, '支付地址生成成功。', { url });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 支付宝异步通知
 * POST /alipay/notify
 */
router.post('/notify', async function (req, res) {
    try {
        const alipayData = req.body;
        const verify = alipaySdk.checkNotifySign(alipayData);

        // 如果验签成功，更新订单与会员信息
        if (verify) {
            // 接收返回参数
            const { out_trade_no, trade_no, gmt_payment } = alipayData;
            await paidSuccess(out_trade_no, trade_no, gmt_payment);

            res.send('success');
        } else {
            logger.warn('支付宝验签失败：', alipayData);
            res.send('fail');
        }
    } catch (error) {
        failure(res, error)
    }
});


/**
 * 支付宝支付成功后，跳转页面
 * GET /alipay/finish
 */
router.get('/finish', async function (req, res) {
    try {
        const alipayData = req.query;
        const verify = alipaySdk.checkNotifySign(alipayData);

        // const verify = alipaySdk.checkNotifySign(alipayData);
        // 验签成功，更新订单与会员信息
        if (verify) {
            // 支付宝不同的环境返回的参数命名规则不一致，要注意接收不同位置的参数
            const { out_trade_no, trade_no, timestamp } = alipayData;
            await paidSuccess(out_trade_no, trade_no, timestamp);

            // res.send('感谢您购买白鲸会员服务，您的支付已成功！');
            // res.redirect('https://baijing.biz');
            // 能给跳转到具体的支付成功详情页面
            res.redirect(`https://api.baijing.biz(网站的URL)/orders/${alipayData.out_trade_no}`);
        } else {
            throw new BadRequest('支付验签失败。');
        }
    } catch (error) {
        failure(res, error)
    }
});



/**
 * 主动查询支付宝订单状态
 * POST /alipay/query
 */
router.post('/query', userAuth, async function (req, res) {
    try {
        // 查询订单
        const order = await getOrder(req);

        const result = await alipaySdk.exec('alipay.trade.query', {
            bizContent: {
                out_trade_no: order.outTradeNo,
            },
        });

        // 获取支付结果相关信息
        const {tradeStatus, outTradeNo, tradeNo, sendPayDate} = result;

        // TRADE_SUCCESS 说明支付成功
        if (tradeStatus === 'TRADE_SUCCESS') {
            // 更新订单状态
            await paidSuccess(outTradeNo, tradeNo, sendPayDate);
        }

        success(res, '执行成功，请重新查询订单。');
    } catch (error) {
        failure(res, error);
    }
});




/**
 * 支付成功后，更新订单状态和会员信息
 * @param outTradeNo
 * @param tradeNo
 * @param paidAt
 * @returns {Promise<void>}
 */


// 事务托管的方式
async function paidSuccess(outTradeNo, tradeNo, paidAt) {
    try {
        // 开启事务
        // sequelize 包住所有的执行语句
        await sequelize.transaction(async (t) => {
            // 查询当前订单（在事务中）
            const order = await Order.findOne({
                where: { outTradeNo: outTradeNo },
                transaction: t,
            });

            // 对于状态已更新的订单，直接返回。防止用户重复请求，重复增加白鲸会员有效期
            if (order.status > 0) {
                return;
            }

            // 更新订单状态（在事务中）
            await order.update({
                tradeNo: tradeNo,     // 流水号
                status: 1,            // 订单状态：已支付
                paymentMethod: 0,     // 支付方式：支付宝
                paidAt: paidAt,       // 支付时间
            }, { transaction: t });

            // 查询订单对应的用户（在事务中）
            const user = await User.findByPk(order.userId, { transaction: t });

            // 将用户组设置为白鲸会员。可防止管理员创建订单，并将用户组修改为白鲸会员
            if (user.role === 0) {
                user.role = 1;
            }

            // 使用moment.js，增加白鲸会员有效期
            user.membershipExpiredAt = moment(user.membershipExpiredAt || new Date())
              .add(order.membershipMonths, 'months')
              .toDate();
            // 演示错误的部分，用于测试事务是否成功
            // user.membershipExpiredAt = '2025年10月10日';

            // 保存用户信息（在事务中）
            await user.save({ transaction: t });
        });
    } catch (error) {
        // 将错误抛出，让上层处理
        throw error;
    }
}




// 非托管事务的写法
// async function paidSuccess(outTradeNo, tradeNo, paidAt) {
//     // 开启事务
//     const t = await Order.sequelize.transaction();
//
//     try {
//         // 查询当前订单（在事务中）
//         const order = await Order.findOne({
//             where: { outTradeNo: outTradeNo },
//             transaction: t,
//         });
//
//         // 对于状态已更新的订单，直接返回。防止用户重复请求，重复增加白鲸会员有效期
//         if (order.status > 0) {
//             return;
//         }
//
//         // 更新订单状态（在事务中）
//         await order.update({
//             tradeNo: tradeNo,     // 流水号
//             status: 1,            // 订单状态：已支付
//             paymentMethod: 0,     // 支付方式：支付宝
//             paidAt: paidAt,       // 支付时间
//         }, { transaction: t });
//
//         // 查询订单对应的用户（在事务中）
//         const user = await User.findByPk(order.userId, { transaction: t });
//
//         // 将用户组设置为白鲸会员。可防止管理员创建订单，并将用户组修改为白鲸会员
//         if (user.role === 0) {
//             user.role = 1;
//         }
//
//         // 使用moment.js，增加白鲸会员有效期
//         user.membershipExpiredAt = moment(user.membershipExpiredAt || new Date())
//           .add(order.membershipMonths, 'months')
//           .toDate();
//         // 错误测试
//         // user.membershipExpiredAt = '2025年10月10日';
//
//         // 保存用户信息（在事务中）
//         await user.save({ transaction: t });
//
//         // 提交事务
//         await t.commit();
//     } catch (error) {
//         // 回滚事务
//         await t.rollback();
//
//         // 将错误抛出，让上层处理
//         throw error;
//     }
// }





/**
 * 查询当前订单
 * @param req
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getOrder(req) {
    const { outTradeNo } = req.body;
    if (!outTradeNo) {
        throw new BadRequest('订单号不能为空。');
    }

    const order = await Order.findOne({
        where: {
            outTradeNo: outTradeNo,
            userId: req.userId
        }
    });

    // 用户只能查看自己的订单
    if (!order) {
        throw new NotFound(`订单号: ${outTradeNo} 的订单未找到。`)
    }

    if (order.status > 0) {
        throw new BadRequest('订单已经支付或取消。')
    }

    return order;
}

module.exports = router;
