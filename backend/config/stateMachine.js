/**
 * 状态机配置 - 定义合法的状态流转路径
 */

// 预约状态流转
const appointmentStateFlow = {
  pending: ['completed', 'cancelled'],     // 待服务 -> 已完成/已取消
  completed: [],                            // 已完成 -> 无后续状态（终态）
  cancelled: []                             // 已取消 -> 无后续状态（终态）
};

// 技师状态流转
const technicianStateFlow = {
  available: ['busy'],     // 空闲 -> 忙碌
  busy: ['available']      // 忙碌 -> 空闲
};

/**
 * 校验状态流转是否合法
 * @param {string} from 当前状态
 * @param {string} to 目标状态
 * @param {object} stateFlow 状态流转配置
 * @returns {boolean}
 */
function canTransfer(from, to, stateFlow) {
  return stateFlow[from]?.includes(to) || false;
}

/**
 * 获取下一状态的合法选项
 * @param {string} currentStatus 当前状态
 * @param {object} stateFlow 状态流转配置
 * @returns {string[]}
 */
function getNextStates(currentStatus, stateFlow) {
  return stateFlow[currentStatus] || [];
}

module.exports = {
  appointmentStateFlow,
  technicianStateFlow,
  canTransfer,
  getNextStates
};