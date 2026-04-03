<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">时间设置</h1>
    
    <!-- 门店选择 -->
    <div class="mb-6">
      <a-form :model="form" layout="inline">
        <a-form-item label="选择门店">
          <a-select v-model:value="selectedStoreId" placeholder="选择门店" @change="getStoreTimeSlots">
            <a-select-option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="showAddModal" :disabled="!selectedStoreId">添加时间段</a-button>
        </a-form-item>
      </a-form>
    </div>
    
    <!-- 时间段列表 -->
    <a-card v-if="selectedStoreId">
      <a-table :columns="columns" :data-source="timeSlots" :pagination="{ pageSize: 10 }">
        <template #column:action="{ record }">
          <a-button type="link" @click="showEditModal(record)">编辑</a-button>
          <a-button type="link" danger @click="deleteTimeSlot(record.id)">删除</a-button>
        </template>
      </a-table>
    </a-card>
    <a-empty v-else description="请选择门店" />
    
    <!-- 添加/编辑模态框 -->
    <a-modal v-model:open="modalVisible" :title="modalTitle">
      <a-form :model="form" layout="vertical">
        <a-form-item label="开始时间">
          <a-time-picker v-model:value="form.start_time" format="HH:mm" />
        </a-form-item>
        <a-form-item label="结束时间">
          <a-time-picker v-model:value="form.end_time" format="HH:mm" />
        </a-form-item>
        <a-form-item label="最大容量">
          <a-input-number v-model:value="form.max_capacity" :min="1" placeholder="请输入最大容量" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="modalVisible = false">取消</a-button>
        <a-button type="primary" @click="saveTimeSlot">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TimeSlots',
  data() {
    return {
      stores: [],
      timeSlots: [],
      selectedStoreId: null,
      modalVisible: false,
      modalTitle: '添加时间段',
      form: {
        id: null,
        start_time: null,
        end_time: null,
        max_capacity: 5
      },
      columns: [
        {
          title: '时间段编号',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '开始时间',
          dataIndex: 'start_time',
          key: 'start_time'
        },
        {
          title: '结束时间',
          dataIndex: 'end_time',
          key: 'end_time'
        },
        {
          title: '最大容量',
          dataIndex: 'max_capacity',
          key: 'max_capacity'
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
        if (this.stores.length > 0) {
          this.selectedStoreId = this.stores[0].id
          this.getStoreTimeSlots()
        }
      } catch (error) {
        console.error('获取门店列表失败:', error)
      }
    },
    async getStoreTimeSlots() {
      if (!this.selectedStoreId) return
      
      try {
        const response = await axios.get(`/api/store/${this.selectedStoreId}`)
        this.timeSlots = response.data.TimeSlots || []
      } catch (error) {
        console.error('获取时间段列表失败:', error)
      }
    },
    showAddModal() {
      this.form = {
        id: null,
        start_time: null,
        end_time: null,
        max_capacity: 5
      }
      this.modalTitle = '添加时间段'
      this.modalVisible = true
    },
    showEditModal(timeSlot) {
      this.form = { ...timeSlot }
      // 转换时间格式
      this.form.start_time = this.formatTime(timeSlot.start_time)
      this.form.end_time = this.formatTime(timeSlot.end_time)
      this.modalTitle = '编辑时间段'
      this.modalVisible = true
    },
    formatTime(timeStr) {
      if (!timeStr) return null
      const [hours, minutes] = timeStr.split(':')
      const date = new Date()
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      return date
    },
    async saveTimeSlot() {
      if (!this.form.start_time || !this.form.end_time || !this.form.max_capacity) {
        this.$message.error('请填写必填字段')
        return
      }
      
      // 格式化时间为 HH:MM 格式
      const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
      }
      
      const timeSlotData = {
        start_time: formatTime(this.form.start_time),
        end_time: formatTime(this.form.end_time),
        max_capacity: this.form.max_capacity
      }
      
      try {
        if (this.form.id) {
          // 编辑
          await axios.put(`/api/store/${this.selectedStoreId}/time-slots/${this.form.id}`, timeSlotData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('更新成功')
        } else {
          // 添加
          await axios.post(`/api/store/${this.selectedStoreId}/time-slots`, timeSlotData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('添加成功')
        }
        this.modalVisible = false
        this.getStoreTimeSlots()
      } catch (error) {
        console.error('保存时间段失败:', error)
        this.$message.error('保存失败')
      }
    },
    async deleteTimeSlot(id) {
      if (confirm('确定要删除这个时间段吗？')) {
        try {
          await axios.delete(`/api/store/${this.selectedStoreId}/time-slots/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          this.$message.success('删除成功')
          this.getStoreTimeSlots()
        } catch (error) {
          console.error('删除时间段失败:', error)
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>
