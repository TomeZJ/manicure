const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { userAuth } = require('../middleware/auth');
require('dotenv').config();

// 用户登录/注册（手机号登录）
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: '手机号不能为空' });
    }
    
    // 查找用户，不存在则创建
    let user = await User.findOne({ where: { phone } });
    
    if (!user) {
      user = await User.create({
        phone,
        name: '',
        avatar: ''
      });
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
router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
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
router.put('/profile', userAuth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    await user.update({
      name: name || user.name,
      avatar: avatar || user.avatar
    });
    
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
