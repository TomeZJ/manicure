const { canTransfer, appointmentStateFlow, technicianStateFlow } = require('../config/stateMachine');

/**
 * 使用乐观锁更新预约状态
 * @param {object} sequelize Sequelize 实例
 * @param {number} id 预约ID
 * @param {string} currentStatus 当前状态（前端传入）
 * @param {string} newStatus 新状态
 * @param {number} version 版本号（前端传入）
 * @returns {object} { success: boolean, message: string, appointment?: object }
 */
async function updateAppointmentStatusWithLock(sequelize, id, currentStatus, newStatus, version) {
  // 1. 状态机校验
  if (!canTransfer(currentStatus, newStatus, appointmentStateFlow)) {
    return {
      success: false,
      message: `状态流转不合法：${currentStatus} -> ${newStatus}`
    };
  }

  // 2. 乐观锁更新
  const result = await sequelize.query(
    `UPDATE appointments
     SET status = ?, version = version + 1, updated_at = NOW()
     WHERE id = ? AND status = ? AND version = ?`,
    { replacements: [newStatus, id, currentStatus, version], type: sequelize.QueryTypes.UPDATE }
  );

  // Sequelize MySQL 返回的 result 是 [rowsAffected, metadata]
  const affectedRows = result[0];

  if (affectedRows === 0) {
    return {
      success: false,
      message: '状态已变更，请刷新页面后重试'
    };
  }

  // 3. 查询更新后的数据
  const [appointment] = await sequelize.query(
    `SELECT * FROM appointments WHERE id = ?`,
    { replacements: [id], type: sequelize.QueryTypes.SELECT }
  );

  return {
    success: true,
    message: '状态更新成功',
    appointment
  };
}

/**
 * 使用乐观锁更新技师状态
 * @param {object} sequelize Sequelize 实例
 * @param {number} id 技师ID
 * @param {string} currentStatus 当前状态（前端传入）
 * @param {string} newStatus 新状态
 * @param {number} version 版本号（前端传入）
 * @returns {object} { success: boolean, message: string, technician?: object }
 */
async function updateTechnicianStatusWithLock(sequelize, id, currentStatus, newStatus, version) {
  // 1. 状态机校验
  if (!canTransfer(currentStatus, newStatus, technicianStateFlow)) {
    return {
      success: false,
      message: `状态流转不合法：${currentStatus} -> ${newStatus}`
    };
  }

  // 2. 乐观锁更新
  const result = await sequelize.query(
    `UPDATE technicians
     SET status = ?, version = version + 1, updated_at = NOW()
     WHERE id = ? AND status = ? AND version = ?`,
    { replacements: [newStatus, id, currentStatus, version], type: sequelize.QueryTypes.UPDATE }
  );

  const affectedRows = result[0];

  if (affectedRows === 0) {
    return {
      success: false,
      message: '状态已变更，请刷新页面后重试'
    };
  }

  // 3. 查询更新后的数据
  const [technician] = await sequelize.query(
    `SELECT * FROM technicians WHERE id = ?`,
    { replacements: [id], type: sequelize.QueryTypes.SELECT }
  );

  return {
    success: true,
    message: '状态更新成功',
    technician
  };
}

module.exports = {
  updateAppointmentStatusWithLock,
  updateTechnicianStatusWithLock
};