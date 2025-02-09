const amqp = require('amqplib');
const {sendMail} = require('./mailser');
const loggers = require('./Logger');



// 创建全局的 RabbitMQ 连接和通道
let connection;
let channel;

/**
 * 连接 RabbitMQ
 * @returns {Promise<void>}
 */
const connectToRabbitMQ = async () => {
    if (connection && channel) return;  // 如果已经连接，直接返回

    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue('mail_queue', { durable: true });
    } catch (error) {
        loggers.error('RabbitMQ 连接失败：', error);
    }
};


/**
 * 发送邮件信息
 * @param msg
 * @returns {Promise<void>}
 */
const mailProducer = async (msg) => {
    try {
        await connectToRabbitMQ(); // 确保已连接

        channel.sendToQueue('mail_queue', Buffer.from(JSON.stringify(msg)), { persistent: true });
    } catch (error) {
        loggers.error('邮件队列生产者错误：', error);
    }
};


/**
 * 接收邮件发送信息
 * @returns {Promise<void>}
 */
const mailConsumer = async () => {
    try {
        await connectToRabbitMQ();
        channel.consume('mail_queue',
            async (msg) => {
                const message = JSON.parse(msg.content.toString());
                await sendMail(message.to, message.subject, message.html);
            }, {
                noAck: true,
            }
        );
    } catch (error) {
        loggers.error('邮件队列消费者错误：', error);
    }
};



module.exports = {
    mailProducer,
    mailConsumer,
};
