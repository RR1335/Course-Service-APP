'use strict';
const bcrypt = require('bcryptjs');
const moment = require('moment/moment');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert(
         'Users',
         [
            {
               email: 'admin@baijing.biz',
               username: 'admin',
               password: bcrypt.hashSync('111222', 10),
               nickname: 'Admin管理员',
               sex: 2,
               role: 100,
               createdAt: new Date(),
               updatedAt: new Date(),
            },
            {
               email: 'user1@baijing.biz',
               username: 'user1',
               password: bcrypt.hashSync('111222', 10),
               nickname: '普通用户1',
               sex: 0,
               role: 0,
               createdAt: new Date(),
               updatedAt: new Date(),
            },
            {
               email: 'user2@baijing.biz',
               username: 'user2',
               password: bcrypt.hashSync('111222', 10),
               nickname: '普通用户2',
               sex: 0,
               role: 0,
               createdAt: new Date(),
               updatedAt: new Date(),
            },
            {
               email: 'user3@baijing.biz',
               username: 'user3',
               password: bcrypt.hashSync('111222', 10),
               nickname: '普通用户3',
               sex: 1,
               role: 0,
               createdAt: new Date(),
               updatedAt: new Date(),
            },
            {
               email: 'm@baijing.biz',
               username: 'member',
               password: bcrypt.hashSync('112233', 10),
               nickname: '白鲸会员用户',
               sex: 1,
               role: 1,
               membershipExpiredAt: moment().add(1, 'year').toDate(),
               createdAt: new Date(),
               updatedAt: new Date(),
            },
         ],
         {}
      );
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Users', null, {});
   },
};
