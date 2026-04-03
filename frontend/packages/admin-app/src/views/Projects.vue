<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">项目管理</h1>
    
    <!-- 操作按钮 -->
    <div class="mb-6">
      <a-button type="primary" @click="showAddModal">添加项目</a-button>
    </div>
    
    <!-- 项目列表 -->
    <a-card>
      <a-table :columns="columns" :data-source="projects" :pagination="{ pageSize: 10 }">
        <template #column:status="{ record }">
          <a-tag :color="record.status === 'active' ? 'green' : 'default'">{{ record.status === 'active' ? '上架' : '下架' }}</a-tag>
        </template>
        <template #column:action="{ record }">
          <a-button type="link" @click="showEditModal(record)">编辑</a-button>
          <a-button type="link" danger @click="deleteProject(record.id)">删除</a-button>
        </template>
      </a-table>
    </a-card>
    
    <!-- 添加/编辑模态框 -->
    <a-modal v-model:open="modalVisible" :title="modalTitle">
      <a-form :model="form" layout="vertical">
        <a-form-item label="项目名称">
          <a-input v-model:value="form.name" placeholder="请输入项目名称" />
        </a-form-item>
        <a-form-item label="分类">
          <a-select v-model:value="form.category" placeholder="选择分类">
            <a-select-option value="纯色">纯色</a-select-option>
            <a-select-option value="款式">款式</a-select-option>
            <a-select-option value="延长">延长</a-select-option>
            <a-select-option value="护理">护理</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="价格">
          <a-input-number v-model:value="form.price" :min="0" :step="0.01" placeholder="请输入价格" />
        </a-form-item>
        <a-form-item label="时长（分钟）">
          <a-input-number v-model:value="form.duration" :min="1" placeholder="请输入时长" />
        </a-form-item>
        <a-form-item label="封面图">
          <a-input v-model:value="form.cover_image" placeholder="请输入图片URL" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model:value="form.description" placeholder="请输入项目描述" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="form.status">
            <a-select-option value="active">上架</a-select-option>
            <a-select-option value="inactive">下架</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="modalVisible = false">取消</a-button>
        <a-button type="primary" @click="saveProject">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Projects',
  data() {
    return {
      projects: [],
      modalVisible: false,
      modalTitle: '添加项目',
      form: {
        id: null,
        name: '',
        category: '',
        price: 0,
        duration: 0,
        cover_image: '',
        description: '',
        status: 'active'
      },
      columns: [
        {
          title: '项目编号',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '分类',
          dataIndex: 'category',
          key: 'category'
        },
        {
          title: '价格',
          dataIndex: 'price',
          key: 'price',
          render: (_, record) => `¥${record.price}`
        },
        {
          title: '时长',
          dataIndex: 'duration',
          key: 'duration',
          render: (_, record) => `${record.duration}分钟`
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    this.getProjects()
  },
  methods: {
    async getProjects() {
      try {
        const response = await axios.get('/api/project')
        this.projects = response.data
      } catch (error) {
        console.error('获取项目列表失败:', error)
      }
    },
    showAddModal() {
      this.form = {
        id: null,
        name: '',
        category: '',
        price: 0,
        duration: 0,
        cover_image: '',
        description: '',
        status: 'active'
      }
      this.modalTitle = '添加项目'
      this.modalVisible = true
    },
    showEditModal(project) {
      this.form = { ...project }
      this.modalTitle = '编辑项目'
      this.modalVisible = true
    },
    async saveProject() {
      if (!this.form.name || !this.form.category || this.form.price === 0 || this.form.duration === 0) {
        this.$message.error('请填写必填字段')
        return
      }
      
      try {
        if (this.form.id) {
          // 编辑
          await axios.put(`/api/project/${this.form.id}`, this.form, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('更新成功')
        } else {
          // 添加
          await axios.post('/api/project', this.form, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('添加成功')
        }
        this.modalVisible = false
        this.getProjects()
      } catch (error) {
        console.error('保存项目失败:', error)
        this.$message.error('保存失败')
      }
    },
    async deleteProject(id) {
      if (confirm('确定要删除这个项目吗？')) {
        try {
          await axios.delete(`/api/project/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('删除成功')
          this.getProjects()
        } catch (error) {
          console.error('删除项目失败:', error)
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>
