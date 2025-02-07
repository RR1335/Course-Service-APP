'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Courses', [
      {
        categoryId: 1,
        userId: 1,
        name: 'Node.js入门',
        recommended: true,
        introductory: true,
        chaptersCount: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoryId: 2,
        userId: 1,
        name: 'Go lang实践升级',
        recommended: true,
        introductory: false,
        chaptersCount: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {});
  }

};
