const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const { Appointment, Store, Technician, User, Project, TimeSlot } = require('../models');
const { userAuth, adminAuth } = require('../middleware/auth');
const { updateAppointmentStatusWithLock } = require('../utils/statusUpdate');
const { canTransfer, appointmentStateFlow, getNextStates } = require('../config/stateMachine');

// 用户创建预约
router.post('/', userAuth, async (req, res) => {
  try {
    // 兼容前端发送的旧字段名格式
    const {
      store_id: storeId,
      technician_id: technicianId,
      project_ids: projectIds,
      appointment_date: appointmentDate,
      time_slot: timeSlot,
      customer_name: customerName,
      customer_phone: customerPhone
    } = req.body;
    
    const appointment = await Appointment.create({
      user_id: req.user.id,
      store_id: storeId,
      technician_id: technicianId,
      project_ids: projectIds,
      appointment_date: appointmentDate,
      time_slot: timeSlot,
      customer_name: customerName,
      customer_phone: customerPhone,
      status: 'pending'
    });
    
    res.status(201).json({
      message: '预约成功',
      appointment
    });
  } catch (error) {
    console.error('创建预约失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取用户的预约列表
router.get('/user', userAuth, async (req, res) => {
  try {
    const { status } = req.query;
    const where = { user_id: req.user.id };
    
    if (status) {
      where.status = status;
    }
    
    const appointments = await Appointment.findAll({
      where,
      include: [Store, Technician, User],
      order: [['created_at', 'DESC']]
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('获取预约列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 取消预约（用户）- 使用乐观锁
router.put('/:id/cancel', userAuth, async (req, res) => {
  try {
    const { version, current_status } = req.body;

    // 前端必须传入 version 和 current_status
    if (!version || !current_status) {
      return res.status(400).json({ message: '请提供 version 和 current_status 参数' });
    }

    const appointment = await Appointment.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: '预约不存在' });
    }

    // 使用乐观锁更新状态
    const result = await updateAppointmentStatusWithLock(
      sequelize,
      req.params.id,
      current_status,
      'cancelled',
      version
    );

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.json({
      message: '预约已取消',
      appointment: result.appointment
    });
  } catch (error) {
    console.error('取消预约失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理员获取所有预约列表
router.get('/admin', adminAuth, async (req, res) => {
  try {
    // 兼容前端发送的下划线命名参数
    const { date, status, technician_id: technicianId, store_id: storeId, user_id: userId } = req.query;
    const where = {};
    
    if (date) {
      where.appointment_date = date;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (technicianId) {
      where.technician_id = technicianId;
    }
    
    if (storeId) {
      where.store_id = storeId;
    }
    
    if (userId) {
      where.user_id = userId;
    }
    
    const appointments = await Appointment.findAll({
      where,
      include: [Store, Technician, User],
      order: [['created_at', 'DESC']]
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('获取预约列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理员更新预约状态 - 使用乐观锁
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, version, current_status } = req.body;

    // 前端必须传入 version 和 current_status
    if (!version || !current_status || !status) {
      return res.status(400).json({ message: '请提供 status、version 和 current_status 参数' });
    }

    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: '预约不存在' });
    }

    // 使用乐观锁更新状态
    const result = await updateAppointmentStatusWithLock(
      sequelize,
      req.params.id,
      current_status,
      status,
      version
    );

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.json({
      message: '状态更新成功',
      appointment: result.appointment
    });
  } catch (error) {
    console.error('更新预约状态失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理员查看预约详情
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [Store, Technician, User]
    });
    
    if (!appointment) {
      return res.status(404).json({ message: '预约不存在' });
    }
    
    // 获取预约的项目详情
    const projectIds = appointment.project_ids.split(',').map(id => parseInt(id));
    const projects = await Project.findAll({ where: { id: projectIds } });
    
    res.json({
      ...appointment.toJSON(),
      projects
    });
  } catch (error) {
    console.error('获取预约详情失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理员删除预约
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: '预约不存在' });
    }
    
    await appointment.destroy();
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除预约失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取可预约时间段（根据门店和日期）
router.get('/available-slots/:storeId', async (req, res) => {
  try {
    const { date } = req.query;
    const storeId = req.params.storeId;
    
    if (!date) {
      return res.status(400).json({ message: '请提供日期' });
    }
    
    // 获取门店的所有时间段
    const timeSlots = await TimeSlot.findAll({ where: { store_id: storeId } });
    
    // 获取该日期已预约的时间段
    const appointments = await Appointment.findAll({
      where: {
        store_id: storeId,
        appointment_date: date,
        status: 'pending'
      }
    });
    
    // 统计每个时间段的预约数量
    const slotCounts = {};
    appointments.forEach(app => {
      if (slotCounts[app.time_slot]) {
        slotCounts[app.time_slot]++;
      } else {
        slotCounts[app.time_slot] = 1;
      }
    });
    
    // 计算可预约的时间段
    const availableSlots = timeSlots.map(slot => {
      const slotKey = `${slot.start_time}-${slot.end_time}`;
      const bookedCount = slotCounts[slotKey] || 0;
      const isAvailable = bookedCount < slot.max_capacity;
      
      return {
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        max_capacity: slot.max_capacity,
        booked_count: bookedCount,
        is_available: isAvailable
      };
    });
    
    res.json(availableSlots);
  } catch (error) {
    console.error('获取可预约时间段失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
