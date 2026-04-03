<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">技师管理</h1>
    
    <!-- 操作按钮 -->
    <div class="mb-6">
      <a-button type="primary" @click="showAddModal">添加技师</a-button>
    </div>
    
    <!-- 技师列表 -->
    <a-card>
      <a-table :columns="columns" :data-source="technicians" :pagination="{ pageSize: 10 }">
        <template #column:avatar="{ record }">
          <img :src="record.avatar || 'https://via.placeholder.com/100'" :alt="record.name" class="w-12 h-12 rounded-full object-cover" />
        </template>
        <template #column:status="{ record }">
          <a-tag :color="record.status === 'working' ? 'green' : 'default'">{{ record.status === 'working' ? '上班' : '休息' }}</a-tag>
        </template>
        <template #column:action="{ record }">
          <a-button type="link" @click="showEditModal(record)">编辑</a-button>
          <a-button type="link" danger @click="deleteTechnician(record.id)">删除</a-button>
        </template>
      </a-table>
    </a-card>
    
    <!-- 添加/编辑模态框 -->
    <a-modal v-model:open="modalVisible" :title="modalTitle">
      <a-form :model="form" layout="vertical">
        <a-form-item label="姓名">
          <a-input v-model:value="form.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="头像">
          <a-input v-model:value="form.avatar" placeholder="请输入头像URL" />
        </a-form-item>
        <a-form-item label="擅长项目">
          <a-textarea v-model:value="form.specialties" placeholder="请输入擅长项目" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="form.status">
            <a-select-option value="working">上班</a-select-option>
            <a-select-option value="rest">休息</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="modalVisible = false">取消</a-button>
        <a-button type="primary" @click="saveTechnician">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Technicians',
  data() {
    return {
      technicians: [],
      modalVisible: false,
      modalTitle: '添加技师',
      form: {
        id: null,
        name: '',
        avatar: '',
        specialties: '',
        status: 'working'
      },
      columns: [
        {
          title: '技师编号',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          key: 'avatar',
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '擅长项目',
          dataIndex: 'specialties',
          key: 'specialties'
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
    this.getTechnicians()
  },
  methods: {
    async getTechnicians() {
      try {
        const response = await axios.get('/api/technician')
        this.technicians = response.data
      } catch (error) {
        console.error('获取技师列表失败:', error)
      }
    },
    showAddModal() {
      this.form = {
        id: null,
        name: '',
        avatar: '',
        specialties: '',
        status: 'working'
      }
      this.modalTitle = '添加技师'
      this.modalVisible = true
    },
    showEditModal(technician) {
      this.form = { ...technician }
      this.modalTitle = '编辑技师'
      this.modalVisible = true
    },
    async saveTechnician() {
      if (!this.form.name) {
        this.$message.error('请填写姓名')
        return
      }
      
      try {
        if (this.form.id) {
          // 编辑
          await axios.put(`/api/technician/${this.form.id}`, this.form, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('更新成功')
        } else {
          // 添加
          await axios.post('/api/technician', this.form, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('添加成功')
        }
        this.modalVisible = false
        this.getTechnicians()
      } catch (error) {
        console.error('保存技师失败:', error)
        this.$message.error('保存失败')
      }
    },
    async deleteTechnician(id) {
      if (confirm('确定要删除这个技师吗？')) {
        try {
          await axios.delete(`/api/technician/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('删除成功')
          this.getTechnicians()
        } catch (error) {
          console.error('删除技师失败:', error)
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>
