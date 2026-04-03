<template>
  <div class="min-h-screen bg-light">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4 flex items-center">
        <router-link to="/" class="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <h1 class="text-xl font-bold">我的预约</h1>
      </div>
    </header>

    <!-- 状态筛选 -->
    <div class="bg-white shadow-sm sticky top-16 z-10 py-3">
      <div class="container mx-auto px-4 overflow-x-auto">
        <div class="flex space-x-4">
          <button 
            v-for="status in statuses" 
            :key="status.value"
            @click="selectStatus(status.value)"
            :class="['px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all', selectedStatus === status.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 预约列表 -->
    <main class="container mx-auto px-4 py-6">
      <div v-if="appointments.length > 0" class="space-y-4">
        <div v-for="appointment in filteredAppointments" :key="appointment.id" class="bg-white rounded-xl p-4 shadow-sm">
          <!-- 预约状态 -->
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-medium">{{ appointment.Store?.name }}</h3>
            <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusClass(appointment.status)]">
              {{ getStatusText(appointment.status) }}
            </span>
          </div>
          
          <!-- 预约信息 -->
          <div class="text-sm text-gray-600 space-y-2 mb-4">
            <p>时间：{{ appointment.appointment_date }} {{ appointment.time_slot }}</p>
            <p>技师：{{ appointment.Technician?.name || '随机安排' }}</p>
            <p>项目：{{ getProjectNames(appointment.project_ids) }}</p>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-3">
            <button 
              v-if="appointment.status === 'pending'" 
              @click="cancelAppointment(appointment.id)"
              class="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              取消预约
            </button>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500">暂无预约记录</p>
      </div>
    </main>

    <!-- 底部导航 -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-md">
      <div class="flex justify-around py-3">
        <router-link to="/" class="flex flex-col items-center text-gray-500 hover:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs">首页</span>
        </router-link>
        <router-link to="/projects" class="flex flex-col items-center text-gray-500 hover:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-xs">项目</span>
        </router-link>
        <router-link to="/appointments" class="flex flex-col items-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-xs">预约</span>
        </router-link>
        <router-link to="/profile" class="flex flex-col items-center text-gray-500 hover:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs">我的</span>
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Appointments',
  data() {
    return {
      appointments: [],
      projects: [],
      statuses: [
        { label: '全部', value: '' },
        { label: '待服务', value: 'pending' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' }
      ],
      selectedStatus: ''
    }
  },
  computed: {
    filteredAppointments() {
      if (!this.selectedStatus) {
        return this.appointments
      }
      return this.appointments.filter(appointment => appointment.status === this.selectedStatus)
    }
  },
  mounted() {
    this.getAppointments()
    this.getProjects()
  },
  methods: {
    async getAppointments() {
      try {
        const response = await axios.get('/api/appointment/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.appointments = response.data
      } catch (error) {
        console.error('获取预约列表失败:', error)
      }
    },
    async getProjects() {
      try {
        const response = await axios.get('/api/project')
        this.projects = response.data
      } catch (error) {
        console.error('获取项目列表失败:', error)
      }
    },
    selectStatus(status) {
      this.selectedStatus = status
    },
    getStatusText(status) {
      const statusMap = {
        pending: '待服务',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      const classMap = {
        pending: 'bg-orange-100 text-orange-600',
        completed: 'bg-green-100 text-green-600',
        cancelled: 'bg-gray-100 text-gray-600'
      }
      return classMap[status] || 'bg-gray-100 text-gray-600'
    },
    getProjectNames(projectIds) {
      const ids = projectIds.split(',').map(id => parseInt(id))
      const projectNames = this.projects
        .filter(project => ids.includes(project.id))
        .map(project => project.name)
      return projectNames.join(', ')
    },
    async cancelAppointment(appointmentId) {
      if (confirm('确定要取消这个预约吗？')) {
        try {
          await axios.put(`/api/appointment/${appointmentId}/cancel`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          alert('预约已取消')
          this.getAppointments()
        } catch (error) {
          console.error('取消预约失败:', error)
          alert('取消预约失败，请稍后重试')
        }
      }
    }
  }
}
</script>
