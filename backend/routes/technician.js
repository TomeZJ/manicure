const express = require('express');
const router = express.Router();
const { Technician } = require('../models');
const { adminAuth } = require('../middleware/auth');

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

// 更新技师（管理员）
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
