const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { storage, generateId } = require('../config/memoryStorage');
const { userAuth } = require('../middleware/auth');
require('dotenv').config();

// 用户登录/注册（手机号登录）
router.post('/login', (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: '手机号不能为空' });
    }
    
    // 查找用户，不存在则创建
    let user = storage.users.find(u => u.phone === phone);
    
    if (!user) {
      user = {
        id: generateId(storage.users),
        phone,
        name: '',
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      storage.users.push(user);
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, phone: user.phone, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取用户信息
router.get('/profile', userAuth, (req, res) => {
  try {
    const user = storage.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json({
      id: user.id,
      phone: user.phone,
      name: user.name,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新用户信息
router.put('/profile', userAuth, (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = storage.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
    user.updatedAt = new Date();
    
    res.json({
      message: '更新成功',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
