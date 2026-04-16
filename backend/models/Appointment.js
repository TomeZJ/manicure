const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'stores',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  technician_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'technicians',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  project_ids: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '项目ID，逗号分隔'
  },
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time_slot: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '预约时间段'
  },
  customer_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  customer_phone: {
    type: DataTypes.STRING(11),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '乐观锁版本号'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
}, {
  tableName: 'appointments',
  timestamps: false
});

module.exports = Appointment;
