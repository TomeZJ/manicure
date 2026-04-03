const express = require('express');
const router = express.Router();
const { Store, TimeSlot } = require('../models');
const { adminAuth } = require('../middleware/auth');

// 获取门店列表
router.get('/', async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    console.error('获取门店列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取门店详情
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [TimeSlot]
    });
    
    if (!store) {
      return res.status(404).json({ message: '门店不存在' });
    }
    
    res.json(store);
  } catch (error) {
    console.error('获取门店详情失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 创建门店（管理员）
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, address, phone, openingHours } = req.body;
    
    const store = await Store.create({
      name,
      address,
      phone,
      opening_hours: openingHours
    });
    
    res.status(201).json({
      message: '创建成功',
      store
    });
  } catch (error) {
    console.error('创建门店失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新门店（管理员）
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, address, phone, openingHours } = req.body;
    const store = await Store.findByPk(req.params.id);
    
    if (!store) {
      return res.status(404).json({ message: '门店不存在' });
    }
    
    await store.update({
      name: name || store.name,
      address: address || store.address,
      phone: phone || store.phone,
      opening_hours: openingHours || store.opening_hours
    });
    
    res.json({
      message: '更新成功',
      store
    });
  } catch (error) {
    console.error('更新门店失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 删除门店（管理员）
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    
    if (!store) {
      return res.status(404).json({ message: '门店不存在' });
    }
    
    // 删除门店的时间段
    await TimeSlot.destroy({ where: { store_id: req.params.id } });
    
    // 删除门店
    await store.destroy();
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除门店失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理门店时间段（管理员）
router.post('/:id/time-slots', adminAuth, async (req, res) => {
  try {
    const { startTime, endTime, maxCapacity } = req.body;
    const store = await Store.findByPk(req.params.id);
    
    if (!store) {
      return res.status(404).json({ message: '门店不存在' });
    }
    
    const timeSlot = await TimeSlot.create({
      store_id: req.params.id,
      start_time: startTime,
      end_time: endTime,
      max_capacity: maxCapacity
    });
    
    res.status(201).json({
      message: '创建时间段成功',
      timeSlot
    });
  } catch (error) {
    console.error('创建时间段失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新门店时间段（管理员）
router.put('/:id/time-slots/:slotId', adminAuth, async (req, res) => {
  try {
    const { startTime, endTime, maxCapacity } = req.body;
    const timeSlot = await TimeSlot.findOne({
      where: {
        id: req.params.slotId,
        store_id: req.params.id
      }
    });
    
    if (!timeSlot) {
      return res.status(404).json({ message: '时间段不存在' });
    }
    
    await timeSlot.update({
      start_time: startTime || timeSlot.start_time,
      end_time: endTime || timeSlot.end_time,
      max_capacity: maxCapacity || timeSlot.max_capacity
    });
    
    res.json({
      message: '更新时间段成功',
      timeSlot
    });
  } catch (error) {
    console.error('更新时间段失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 删除门店时间段（管理员）
router.delete('/:id/time-slots/:slotId', adminAuth, async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findOne({
      where: {
        id: req.params.slotId,
        store_id: req.params.id
      }
    });
    
    if (!timeSlot) {
      return res.status(404).json({ message: '时间段不存在' });
    }
    
    await timeSlot.destroy();
    
    res.json({ message: '删除时间段成功' });
  } catch (error) {
    console.error('删除时间段失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
