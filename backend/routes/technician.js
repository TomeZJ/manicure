const express = require('express');
const router = express.Router();
const { storage, generateId } = require('../config/memoryStorage');
const { adminAuth } = require('../middleware/auth');

// 获取技师列表
router.get('/', (req, res) => {
  try {
    const { status } = req.query;
    let technicians = storage.technicians;
    
    if (status) {
      technicians = technicians.filter(t => t.status === status);
    }
    
    res.json(technicians);
  } catch (error) {
    console.error('获取技师列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取技师详情
router.get('/:id', (req, res) => {
  try {
    const technician = storage.technicians.find(t => t.id === parseInt(req.params.id));
    
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
router.post('/', adminAuth, (req, res) => {
  try {
    const { name, avatar, skills, status, storeId } = req.body;
    
    const technician = {
      id: generateId(storage.technicians),
      name,
      avatar,
      skills,
      status: status || 'available',
      storeId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.technicians.push(technician);
    
    res.status(201).json({
      message: '创建成功',
      technician
    });
  } catch (error) {
    console.error('创建技师失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新技师（管理员）
router.put('/:id', adminAuth, (req, res) => {
  try {
    const { name, avatar, skills, status, storeId } = req.body;
    const technician = storage.technicians.find(t => t.id === parseInt(req.params.id));
    
    if (!technician) {
      return res.status(404).json({ message: '技师不存在' });
    }
    
    technician.name = name || technician.name;
    technician.avatar = avatar || technician.avatar;
    technician.skills = skills || technician.skills;
    technician.status = status || technician.status;
    technician.storeId = storeId || technician.storeId;
    technician.updatedAt = new Date();
    
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
router.delete('/:id', adminAuth, (req, res) => {
  try {
    const technicianIndex = storage.technicians.findIndex(t => t.id === parseInt(req.params.id));
    
    if (technicianIndex === -1) {
      return res.status(404).json({ message: '技师不存在' });
    }
    
    storage.technicians.splice(technicianIndex, 1);
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除技师失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
