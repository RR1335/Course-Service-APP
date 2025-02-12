const nodemailer = require('nodemailer');
const loggers = require('./Logger');
// const {error} = require("winston");

/**
 * 配置邮件服务器信息
 */
const transporter = nodemailer.createTransport({
   host: process.env.MAILER_HOST,
   port: process.env.MAILER_PORT,
   secure: process.env.MAILER_SECURE,
   auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
   },
});

/**
 * 发送邮件
 * 变量： email, subject, html
 * @returns {Promise<void>}
 */
const sendMail = async (email, subject, html) => {
   try {
      await transporter.sendMail({
         from: process.env.MAILER_USER,
         to: email,
         subject,
         html,
      });
   } catch (err) {
      loggers.error('邮件发送失败', err);
   }
};

module.exports = {
   sendMail,
};
