<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">门店管理</h1>
    
    <!-- 操作按钮 -->
    <div class="mb-6">
      <a-button type="primary" @click="showAddModal">添加门店</a-button>
    </div>
    
    <!-- 门店列表 -->
    <a-card>
      <a-table :columns="columns" :data-source="stores" :pagination="{ pageSize: 10 }">
        <template #column:action="{ record }">
          <a-button type="link" @click="showEditModal(record)">编辑</a-button>
          <a-button type="link" danger @click="deleteStore(record.id)">删除</a-button>
        </template>
      </a-table>
    </a-card>
    
    <!-- 添加/编辑模态框 -->
    <a-modal v-model:open="modalVisible" :title="modalTitle">
      <a-form :model="form" layout="vertical">
        <a-form-item label="门店名称">
          <a-input v-model:value="form.name" placeholder="请输入门店名称" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model:value="form.address" placeholder="请输入地址" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="form.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="营业时间">
          <a-input v-model:value="form.opening_hours" placeholder="请输入营业时间，例如：10:00-20:00" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="modalVisible = false">取消</a-button>
        <a-button type="primary" @click="saveStore">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Stores',
  data() {
    return {
      stores: [],
      modalVisible: false,
      modalTitle: '添加门店',
      form: {
        id: null,
        name: '',
        address: '',
        phone: '',
        opening_hours: ''
      },
      columns: [
        {
          title: '门店编号',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '门店名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '地址',
          dataIndex: 'address',
          key: 'address'
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '营业时间',
          dataIndex: 'opening_hours',
          key: 'opening_hours'
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
    this.getStores()
  },
  methods: {
    async getStores() {
      try {
        const response = await axios.get('/api/store')
        this.stores = response.data
      } catch (error) {
        console.error('获取门店列表失败:', error)
      }
    },
    showAddModal() {
      this.form = {
        id: null,
        name: '',
        address: '',
        phone: '',
        opening_hours: ''
      }
      this.modalTitle = '添加门店'
      this.modalVisible = true
    },
    showEditModal(store) {
      this.form = { ...store }
      this.modalTitle = '编辑门店'
      this.modalVisible = true
    },
    async saveStore() {
      if (!this.form.name || !this.form.address || !this.form.phone || !this.form.opening_hours) {
        this.$message.error('请填写必填字段')
        return
      }
      
      try {
        if (this.form.id) {
          // 编辑
          await axios.put(`/api/store/${this.form.id}`, this.form, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('更新成功')
        } else {
          // 添加
          await axios.post('/api/store', this.form, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('添加成功')
        }
        this.modalVisible = false
        this.getStores()
      } catch (error) {
        console.error('保存门店失败:', error)
        this.$message.error('保存失败')
      }
    },
    async deleteStore(id) {
      if (confirm('确定要删除这个门店吗？')) {
        try {
          await axios.delete(`/api/store/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('删除成功')
          this.getStores()
        } catch (error) {
          console.error('删除门店失败:', error)
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>
