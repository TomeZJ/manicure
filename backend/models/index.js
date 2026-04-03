const sequelize = require('../config/database');

// 导入模型
const User = require('./User');
const Admin = require('./Admin');
const Project = require('./Project');
const Technician = require('./Technician');
const Store = require('./Store');
const TimeSlot = require('./TimeSlot');
const Appointment = require('./Appointment');

// 定义模型关系
Store.hasMany(TimeSlot, { foreignKey: 'store_id', onDelete: 'CASCADE' });
TimeSlot.belongsTo(Store, { foreignKey: 'store_id' });

User.hasMany(Appointment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: 'user_id' });

Store.hasMany(Appointment, { foreignKey: 'store_id', onDelete: 'CASCADE' });
Appointment.belongsTo(Store, { foreignKey: 'store_id' });

Technician.hasMany(Appointment, { foreignKey: 'technician_id', onDelete: 'SET NULL' });
Appointment.belongsTo(Technician, { foreignKey: 'technician_id' });

// 同步数据库
sequelize.sync({ alter: true })
  .then(() => {
    console.log('数据库模型同步成功');
  })
  .catch(err => {
    console.error('数据库模型同步失败:', err);
  });

module.exports = {
  User,
  Admin,
  Project,
  Technician,
  Store,
  TimeSlot,
  Appointment
};
