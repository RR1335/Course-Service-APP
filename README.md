RR1335

这是一套课程展示，购买的后台API和对接View的API。

在macOS上开发：

    1.数据库 —— MySQL

    2.开发语言 —— JavaScript （ Node.js and Express ）

    3.API类型 —— JSON

#配置环境变量

    PORT=3000

    SECRET= your secret jwt

#安装和执行

    npm i

其它配置信息都在 package.json 中查看

#阿里云的环境配置

    NODE_ENV=development
    PORT=
    SECRET=
    ALIYUN_ACCESS_KEY_ID=
    ALIYUN_ACCESS_KEY_SECRET=
    ALIYUN_BUCKET=
    ALIYUN_REGION=

#邮件服务器配置

    MAILER_HOST=邮件服务器地址
    MAILER_PORT=邮件服务器端口
    MAILER_SECURE=465端口填写：true，否则填写：false
    MAILER_USER=你的邮箱地址
    MAILER_PASS=你的邮箱授权码或密码

#消息队列

    消息队列服务器 RabbitMQ
    RABBITMQ_URL= 消息队列服务器地址
       - RABBITMQ_URL=amqp://username:password@localhost
