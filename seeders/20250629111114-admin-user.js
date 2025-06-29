const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin1234', 10); // Your password

    await queryInterface.bulkInsert('Users', [{
      type: 'admin',
      user_name: 'mainadmin',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { user_name: 'mainadmin' }, {});
  }
};