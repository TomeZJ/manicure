const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const { adminAuth } = require('../middleware/auth');

// 获取项目列表
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (status) {
      where.status = status;
    }
    
    const projects = await Project.findAll({ where });
    
    res.json(projects);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取项目详情
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 创建项目（管理员）
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, category, price, duration, image, description, status } = req.body;
    
    const project = await Project.create({
      name,
      category,
      price,
      duration,
      image,
      description,
      status: status || 'active'
    });
    
    res.status(201).json({
      message: '创建成功',
      project
    });
  } catch (error) {
    console.error('创建项目失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新项目（管理员）
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, category, price, duration, image, description, status } = req.body;
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    await project.update({
      name: name || project.name,
      category: category || project.category,
      price: price || project.price,
      duration: duration || project.duration,
      image: image || project.image,
      description: description || project.description,
      status: status || project.status
    });
    
    res.json({
      message: '更新成功',
      project
    });
  } catch (error) {
    console.error('更新项目失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 删除项目（管理员）
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    
    await project.destroy();
    
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除项目失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
