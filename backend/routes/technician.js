const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const { Technician } = require('../models');
const { adminAuth } = require('../middleware/auth');
const { updateTechnicianStatusWithLock } = require('../utils/statusUpdate');
const { canTransfer, technicianStateFlow, getNextStates } = require('../config/stateMachine');

// 获取技师列表
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    const technicians = await Technician.findAll({ where });
    
    res.json(technicians);
  } catch (error) {
    console.error('获取技师列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取技师详情
router.get('/:id', async (req, res) => {
  try {
    const technician = await Technician.findByPk(req.params.id);
    
    if (!technician) {
      return res.status(404).json({ message: '技师不存在' });
    }
    
    res.json(technician);
  } catch (error) {
    console.error('获取技师详情失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 创建技师（管理员）
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, avatar, skills, status, storeId } = req.body;
    
    const technician = await Technician.create({
      name,
      avatar,
      skills,
      status: status || 'available',
      store_id: storeId
    });
    
    res.status(201).json({
      message: '创建成功',
      technician
    });
  } catch (error) {
    console.error('创建技师失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新技师状态（管理员）- 使用乐观锁
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, version, current_status } = req.body;

    // 前端必须传入 version 和 current_status
    if (!version || !current_status || !status) {
      return res.status(400).json({ message: '请提供 status、version 和 current_status 参数' });
    }

    const technician = await Technician.findByPk(req.params.id);

    if (!technician) {
      return res.status(404).json({ message: '技师不存在' });
    }

    // 使用乐观锁更新状态
    const result = await updateTechnicianStatusWithLock(
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
      technician: result.technician
    });
  } catch (error) {
    console.error('更新技师状态失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新技师信息（管理员）- 不涉及状态变更
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, avatar, skills, status, storeId } = req.body;
    const technician = await Technician.findByPk(req.params.id);
    
    if (!technician) {
      return res.status(404).json({ message: '技师不存在' });
    }
    
    await technician.update({
      name: name || technician.name,
      avatar: avatar || technician.avatar,
      skills: skills || technician.skills,
      status: status || technician.status,
      store_id: storeId || technician.store_id
    });
    
    res.json({
      message: '更新成功',
      technician
    });
  } catch (error) {
    console.error('更新技师失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 删除技师（管理员）
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const technician = await Technician.findByPk(req.params.id);
    
    if (!technician) {
      return res.status(404).json({ message: '技师不存在' });
    }
    
    await technician.destroy();
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除技师失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
