const { User } = require('../models/');

async function insertDefaultUsers() {
  const existingAdminUser = await User.findOne({ username: 'admin' }).exec();
  if (!existingAdminUser) {
    const adminUser = new User({
      name: 'administrator',
      username: 'admin',
      password: 'admin',
      email: 'admin@localhost',
      verified: true,
      role: 'admin',
      phoneNumber: '09000000000',
    });
    adminUser.save();
  }
}
module.exports = {
  insertDefaultUsers,
};
