const express = require('express');
const router = express.Router();
const { storage, generateId } = require('../config/memoryStorage');
const { userAuth, adminAuth } = require('../middleware/auth');

// 用户创建预约
router.post('/', userAuth, (req, res) => {
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
    
    const appointment = {
      id: generateId(storage.appointments),
      userId: req.user.id,
      storeId,
      technicianId,
      projectIds: projectIds,
      appointmentDate,
      timeSlot,
      customerName,
      customerPhone,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.appointments.push(appointment);
    
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
router.get('/user', userAuth, (req, res) => {
  try {
    const { status } = req.query;
    let appointments = storage.appointments.filter(a => a.userId === req.user.id);
    
    if (status) {
      appointments = appointments.filter(a => a.status === status);
    }
    
    // 排序：按创建时间倒序
    appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 关联数据
    const appointmentsWithDetails = appointments.map(appointment => {
      const store = storage.stores.find(s => s.id === appointment.storeId);
      const technician = storage.technicians.find(t => t.id === appointment.technicianId);
      const user = storage.users.find(u => u.id === appointment.userId);
      
      return {
        ...appointment,
        store,
        technician,
        user
      };
    });
    
    res.json(appointmentsWithDetails);
  } catch (error) {
    console.error('获取预约列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 取消预约（用户）
router.put('/:id/cancel', userAuth, (req, res) => {
  try {
    const appointment = storage.appointments.find(a => a.id === parseInt(req.params.id) && a.userId === req.user.id);
    
    if (!appointment) {
      return res.status(404).json({ message: '预约不存在' });
    }
    
    if (appointment.status !== 'pending') {
      return res.status(400).json({ message: '只能取消待服务的预约' });
    }
    
    appointment.status = 'cancelled';
    appointment.updatedAt = new Date();
    
    res.json({ message: '预约已取消' });
  } catch (error) {
    console.error('取消预约失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理员获取所有预约列表
router.get('/admin', adminAuth, (req, res) => {
  try {
    // 兼容前端发送的下划线命名参数
    const { date, status, technician_id: technicianId, store_id: storeId, user_id: userId } = req.query;
    let appointments = storage.appointments;
    
    if (date) {
      appointments = appointments.filter(a => a.appointmentDate === date);
    }
    
    if (status) {
      appointments = appointments.filter(a => a.status === status);
    }
    
    if (technicianId) {
      appointments = appointments.filter(a => a.technicianId === parseInt(technicianId));
    }
    
    if (storeId) {
      appointments = appointments.filter(a => a.storeId === parseInt(storeId));
    }
    
    if (userId) {
      appointments = appointments.filter(a => a.userId === parseInt(userId));
    }
    
    // 排序：按创建时间倒序
    appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 关联数据
    const appointmentsWithDetails = appointments.map(appointment => {
      const store = storage.stores.find(s => s.id === appointment.storeId);
      const technician = storage.technicians.find(t => t.id === appointment.technicianId);
      const user = storage.users.find(u => u.id === appointment.userId);
      
      return {
        ...appointment,
        store,
        technician,
        user
      };
    });
    
    res.json(appointmentsWithDetails);
  } catch (error) {
    console.error('获取预约列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理员更新预约状态
router.put('/:id/status', adminAuth, (req, res) => {
  try {
    const { status } = req.body;
    const appointment = storage.appointments.find(a => a.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({ message: '预约不存在' });
    }
    
    appointment.status = status;
    appointment.updatedAt = new Date();
    
    res.json({
      message: '状态更新成功',
      appointment
    });
  } catch (error) {
    console.error('更新预约状态失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理员查看预约详情
router.get('/:id', adminAuth, (req, res) => {
  try {
    const appointment = storage.appointments.find(a => a.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({ message: '预约不存在' });
    }
    
    // 关联数据
    const store = storage.stores.find(s => s.id === appointment.storeId);
    const technician = storage.technicians.find(t => t.id === appointment.technicianId);
    const user = storage.users.find(u => u.id === appointment.userId);
    
    // 获取预约的项目详情
    const projectIds = appointment.projectIds.split(',').map(id => parseInt(id));
    const projects = storage.projects.filter(p => projectIds.includes(p.id));
    
    res.json({
      ...appointment,
      store,
      technician,
      user,
      projects
    });
  } catch (error) {
    console.error('获取预约详情失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理员删除预约
router.delete('/:id', adminAuth, (req, res) => {
  try {
    const appointmentIndex = storage.appointments.findIndex(a => a.id === parseInt(req.params.id));
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: '预约不存在' });
    }
    
    storage.appointments.splice(appointmentIndex, 1);
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除预约失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取可预约时间段（根据门店和日期）
router.get('/available-slots/:storeId', (req, res) => {
  try {
    const { date } = req.query;
    const storeId = parseInt(req.params.storeId);
    
    if (!date) {
      return res.status(400).json({ message: '请提供日期' });
    }
    
    // 获取门店的所有时间段
    const timeSlots = storage.timeSlots.filter(t => t.storeId === storeId);
    
    // 获取该日期已预约的时间段
    const appointments = storage.appointments.filter(a => 
      a.storeId === storeId && 
      a.appointmentDate === date && 
      a.status === 'pending'
    );
    
    // 统计每个时间段的预约数量
    const slotCounts = {};
    appointments.forEach(app => {
      if (slotCounts[app.timeSlot]) {
        slotCounts[app.timeSlot]++;
      } else {
        slotCounts[app.timeSlot] = 1;
      }
    });
    
    // 计算可预约的时间段
    const availableSlots = timeSlots.map(slot => {
      const slotKey = `${slot.startTime}-${slot.endTime}`;
      const bookedCount = slotCounts[slotKey] || 0;
      const isAvailable = bookedCount < slot.maxCapacity;
      
      return {
        id: slot.id,
        start_time: slot.startTime,
        end_time: slot.endTime,
        max_capacity: slot.maxCapacity,
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
