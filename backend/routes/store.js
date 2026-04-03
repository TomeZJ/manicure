const express = require('express');
const router = express.Router();
const { storage, generateId } = require('../config/memoryStorage');
const { adminAuth } = require('../middleware/auth');

// 获取门店列表
router.get('/', (req, res) => {
  try {
    res.json(storage.stores);
  } catch (error) {
    console.error('获取门店列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取门店详情
router.get('/:id', (req, res) => {
  try {
    const store = storage.stores.find(s => s.id === parseInt(req.params.id));
    
    if (!store) {
      return res.status(404).json({ message: '门店不存在' });
    }
    
    // 获取门店的时间段
    const timeSlots = storage.timeSlots.filter(t => t.storeId === parseInt(req.params.id));
    
    res.json({
      ...store,
      timeSlots
    });
  } catch (error) {
    console.error('获取门店详情失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 创建门店（管理员）
router.post('/', adminAuth, (req, res) => {
  try {
    const { name, address, phone, openingHours } = req.body;
    
    const store = {
      id: generateId(storage.stores),
      name,
      address,
      phone,
      openingHours,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.stores.push(store);
    
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
router.put('/:id', adminAuth, (req, res) => {
  try {
    const { name, address, phone, openingHours } = req.body;
    const store = storage.stores.find(s => s.id === parseInt(req.params.id));
    
    if (!store) {
      return res.status(404).json({ message: '门店不存在' });
    }
    
    store.name = name || store.name;
    store.address = address || store.address;
    store.phone = phone || store.phone;
    store.openingHours = openingHours || store.openingHours;
    store.updatedAt = new Date();
    
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
router.delete('/:id', adminAuth, (req, res) => {
  try {
    const storeIndex = storage.stores.findIndex(s => s.id === parseInt(req.params.id));
    
    if (storeIndex === -1) {
      return res.status(404).json({ message: '门店不存在' });
    }
    
    // 删除门店的时间段
    storage.timeSlots = storage.timeSlots.filter(t => t.storeId !== parseInt(req.params.id));
    
    // 删除门店
    storage.stores.splice(storeIndex, 1);
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除门店失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 管理门店时间段（管理员）
router.post('/:id/time-slots', adminAuth, (req, res) => {
  try {
    const { startTime, endTime, maxCapacity } = req.body;
    const store = storage.stores.find(s => s.id === parseInt(req.params.id));
    
    if (!store) {
      return res.status(404).json({ message: '门店不存在' });
    }
    
    const timeSlot = {
      id: generateId(storage.timeSlots),
      storeId: parseInt(req.params.id),
      startTime,
      endTime,
      maxCapacity,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.timeSlots.push(timeSlot);
    
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
router.put('/:id/time-slots/:slotId', adminAuth, (req, res) => {
  try {
    const { startTime, endTime, maxCapacity } = req.body;
    const timeSlot = storage.timeSlots.find(t => t.id === parseInt(req.params.slotId) && t.storeId === parseInt(req.params.id));
    
    if (!timeSlot) {
      return res.status(404).json({ message: '时间段不存在' });
    }
    
    timeSlot.startTime = startTime || timeSlot.startTime;
    timeSlot.endTime = endTime || timeSlot.endTime;
    timeSlot.maxCapacity = maxCapacity || timeSlot.maxCapacity;
    timeSlot.updatedAt = new Date();
    
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
router.delete('/:id/time-slots/:slotId', adminAuth, (req, res) => {
  try {
    const timeSlotIndex = storage.timeSlots.findIndex(t => t.id === parseInt(req.params.slotId) && t.storeId === parseInt(req.params.id));
    
    if (timeSlotIndex === -1) {
      return res.status(404).json({ message: '时间段不存在' });
    }
    
    storage.timeSlots.splice(timeSlotIndex, 1);
    
    res.json({ message: '删除时间段成功' });
  } catch (error) {
    console.error('删除时间段失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
