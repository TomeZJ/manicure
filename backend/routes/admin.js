const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { storage } = require('../config/memoryStorage');
const { adminAuth } = require('../middleware/auth');
require('dotenv').config();

// 管理员登录
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }
    
    // 查找管理员
    const admin = storage.admins.find(a => a.username === username);
    
    if (!admin) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 验证密码（这里简化处理，实际应该使用bcrypt）
    // 由于是演示，我们直接比较密码
    if (password !== '123456') {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: admin.id, username: admin.username, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      message: '登录成功',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取管理员信息
router.get('/profile', adminAuth, (req, res) => {
  try {
    const admin = storage.admins.find(a => a.id === req.admin.id);
    
    if (!admin) {
      return res.status(404).json({ message: '管理员不存在' });
    }
    
    res.json({
      id: admin.id,
      username: admin.username,
      name: admin.name
    });
  } catch (error) {
    console.error('获取管理员信息失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
