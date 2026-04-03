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
        <h1 class="text-xl font-bold">预约流程</h1>
      </div>
    </header>

    <!-- 预约步骤 -->
    <div class="bg-white shadow-sm sticky top-16 z-10 py-3">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <div :class="['flex flex-col items-center', step >= 1 ? 'text-primary' : 'text-gray-400']">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center mb-1', step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400']">1</div>
            <span class="text-xs">选择项目</span>
          </div>
          <div :class="['flex-1 h-1 mx-2', step >= 2 ? 'bg-primary' : 'bg-gray-200']"></div>
          <div :class="['flex flex-col items-center', step >= 2 ? 'text-primary' : 'text-gray-400']">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center mb-1', step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400']">2</div>
            <span class="text-xs">选择门店</span>
          </div>
          <div :class="['flex-1 h-1 mx-2', step >= 3 ? 'bg-primary' : 'bg-gray-200']"></div>
          <div :class="['flex flex-col items-center', step >= 3 ? 'text-primary' : 'text-gray-400']">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center mb-1', step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400']">3</div>
            <span class="text-xs">选择时间</span>
          </div>
          <div :class="['flex-1 h-1 mx-2', step >= 4 ? 'bg-primary' : 'bg-gray-200']"></div>
          <div :class="['flex flex-col items-center', step >= 4 ? 'text-primary' : 'text-gray-400']">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center mb-1', step >= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400']">4</div>
            <span class="text-xs">确认信息</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 预约内容 -->
    <main class="container mx-auto px-4 py-6">
      <!-- 步骤1：选择项目 -->
      <div v-if="step === 1" class="space-y-4">
        <h2 class="text-lg font-bold mb-4">选择项目</h2>
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="project in projects" 
            :key="project.id" 
            :class="['card cursor-pointer border-2 transition-all', selectedProjects.includes(project.id) ? 'border-primary' : 'border-transparent']" 
            @click="toggleProject(project.id)"
          >
            <img :src="project.cover_image" :alt="project.name" class="w-full h-32 object-cover rounded-lg mb-2" />
            <h3 class="font-medium text-sm mb-1">{{ project.name }}</h3>
            <div class="flex justify-between items-center">
              <span class="text-primary font-bold text-sm">¥{{ project.price }}</span>
              <span class="text-xs text-gray-500">{{ project.duration }}分钟</span>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <button @click="nextStep" :disabled="selectedProjects.length === 0" class="btn-primary" :class="selectedProjects.length === 0 ? 'opacity-50 cursor-not-allowed' : ''">
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤2：选择门店 -->
      <div v-if="step === 2" class="space-y-4">
        <h2 class="text-lg font-bold mb-4">选择门店</h2>
        <div class="space-y-3">
          <div 
            v-for="store in stores" 
            :key="store.id" 
            :class="['card cursor-pointer', selectedStore === store.id ? 'border-2 border-primary' : '']" 
            @click="selectStore(store.id)"
          >
            <h3 class="font-medium mb-2">{{ store.name }}</h3>
            <p class="text-sm text-gray-600 mb-1">{{ store.address }}</p>
            <p class="text-sm text-gray-600 mb-1">联系电话：{{ store.phone }}</p>
            <p class="text-sm text-gray-600">营业时间：{{ store.opening_hours }}</p>
          </div>
        </div>
        <div class="flex justify-between mt-6">
          <button @click="prevStep" class="px-4 py-2 border border-gray-300 rounded-full font-medium text-gray-600 hover:bg-gray-50">
            上一步
          </button>
          <button @click="nextStep" :disabled="!selectedStore" class="btn-primary" :class="!selectedStore ? 'opacity-50 cursor-not-allowed' : ''">
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤3：选择时间 -->
      <div v-if="step === 3" class="space-y-4">
        <h2 class="text-lg font-bold mb-4">选择时间</h2>
        
        <!-- 选择日期 -->
        <div class="bg-white rounded-xl p-4">
          <h3 class="font-medium mb-3">选择日期</h3>
          <div class="flex overflow-x-auto space-x-3 pb-2">
            <div 
              v-for="date in availableDates" 
              :key="date.date" 
              :class="['flex-shrink-0 w-20 flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all', selectedDate === date.date ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
              @click="selectDate(date.date)"
            >
              <span class="text-sm">{{ date.weekday }}</span>
              <span class="text-lg font-medium mt-1">{{ date.day }}</span>
              <span class="text-xs mt-1">{{ date.month }}</span>
            </div>
          </div>
        </div>

        <!-- 选择技师 -->
        <div class="bg-white rounded-xl p-4">
          <h3 class="font-medium mb-3">选择技师</h3>
          <div class="flex items-center space-x-4">
            <div 
              :class="['flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all', selectedTechnician === null ? 'border-primary bg-primary/5' : 'border-transparent']"
              @click="selectTechnician(null)"
            >
              <div class="text-center">
                <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span class="font-medium">随机安排</span>
              </div>
            </div>
            <div 
              v-for="technician in technicians" 
              :key="technician.id"
              :class="['flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all', selectedTechnician === technician.id ? 'border-primary bg-primary/5' : 'border-transparent']"
              @click="selectTechnician(technician.id)"
            >
              <div class="text-center">
                <img :src="technician.avatar" :alt="technician.name" class="w-16 h-16 rounded-full object-cover mx-auto mb-2" />
                <span class="font-medium">{{ technician.name }}</span>
                <p class="text-xs text-gray-500 mt-1">{{ technician.specialties }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 选择时间段 -->
        <div class="bg-white rounded-xl p-4">
          <h3 class="font-medium mb-3">选择时间段</h3>
          <div v-if="availableSlots.length > 0" class="grid grid-cols-3 gap-3">
            <button 
              v-for="slot in availableSlots" 
              :key="slot.id"
              :class="['py-2 rounded-lg text-center text-sm font-medium transition-all', slot.is_available && selectedTimeSlot !== slot.id ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : selectedTimeSlot === slot.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed']"
              :disabled="!slot.is_available"
              @click="selectTimeSlot(slot.id, `${slot.start_time}-${slot.end_time}`)"
            >
              {{ slot.start_time }}-{{ slot.end_time }}
            </button>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            该日期暂无可预约时间段
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button @click="prevStep" class="px-4 py-2 border border-gray-300 rounded-full font-medium text-gray-600 hover:bg-gray-50">
            上一步
          </button>
          <button @click="nextStep" :disabled="!selectedDate || !selectedTimeSlot" class="btn-primary" :class="!selectedDate || !selectedTimeSlot ? 'opacity-50 cursor-not-allowed' : ''">
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤4：确认信息 -->
      <div v-if="step === 4" class="space-y-4">
        <h2 class="text-lg font-bold mb-4">确认信息</h2>
        <div class="bg-white rounded-xl p-4 space-y-4">
          <!-- 项目信息 -->
          <div>
            <h3 class="font-medium mb-2">预约项目</h3>
            <div v-for="project in selectedProjectsInfo" :key="project.id" class="flex justify-between items-center py-2 border-b border-gray-100">
              <span>{{ project.name }}</span>
              <span class="text-primary">¥{{ project.price }}</span>
            </div>
          </div>
          
          <!-- 门店信息 -->
          <div>
            <h3 class="font-medium mb-2">预约门店</h3>
            <p>{{ selectedStoreInfo?.name }}</p>
            <p class="text-sm text-gray-600">{{ selectedStoreInfo?.address }}</p>
          </div>
          
          <!-- 时间信息 -->
          <div>
            <h3 class="font-medium mb-2">预约时间</h3>
            <p>{{ selectedDate }} {{ selectedTimeSlotText }}</p>
          </div>
          
          <!-- 技师信息 -->
          <div>
            <h3 class="font-medium mb-2">预约技师</h3>
            <p>{{ selectedTechnicianInfo?.name || '随机安排' }}</p>
          </div>
          
          <!-- 联系信息 -->
          <div>
            <h3 class="font-medium mb-2">联系信息</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input v-model="customerName" type="text" class="input" placeholder="请输入姓名" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                <input v-model="customerPhone" type="tel" class="input" placeholder="请输入手机号" maxlength="11" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between mt-6">
          <button @click="prevStep" class="px-4 py-2 border border-gray-300 rounded-full font-medium text-gray-600 hover:bg-gray-50">
            上一步
          </button>
          <button @click="submitBooking" :disabled="!customerName || !customerPhone" class="btn-primary" :class="!customerName || !customerPhone ? 'opacity-50 cursor-not-allowed' : ''">
            提交预约
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Booking',
  data() {
    return {
      step: 1,
      projects: [],
      selectedProjects: [],
      stores: [],
      selectedStore: null,
      technicians: [],
      selectedTechnician: null,
      availableDates: [],
      selectedDate: null,
      availableSlots: [],
      selectedTimeSlot: null,
      selectedTimeSlotText: '',
      customerName: '',
      customerPhone: ''
    }
  },
  computed: {
    selectedProjectsInfo() {
      return this.projects.filter(project => this.selectedProjects.includes(project.id))
    },
    selectedStoreInfo() {
      return this.stores.find(store => store.id === this.selectedStore)
    },
    selectedTechnicianInfo() {
      return this.technicians.find(technician => technician.id === this.selectedTechnician)
    }
  },
  mounted() {
    this.getProjects()
    this.getStores()
    this.getTechnicians()
    this.generateAvailableDates()
  },
  methods: {
    async getProjects() {
      try {
        const response = await axios.get('/api/project')
        this.projects = response.data
        
        // 如果有从项目详情页传来的项目ID，自动选中
        const bookingProjectId = localStorage.getItem('bookingProjectId')
        if (bookingProjectId) {
          this.selectedProjects = [parseInt(bookingProjectId)]
          localStorage.removeItem('bookingProjectId')
        }
      } catch (error) {
        console.error('获取项目列表失败:', error)
      }
    },
    async getStores() {
      try {
        const response = await axios.get('/api/store')
        this.stores = response.data
      } catch (error) {
        console.error('获取门店列表失败:', error)
      }
    },
    async getTechnicians() {
      try {
        const response = await axios.get('/api/technician')
        this.technicians = response.data
      } catch (error) {
        console.error('获取技师列表失败:', error)
      }
    },
    generateAvailableDates() {
      const dates = []
      const today = new Date()
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const month = date.getMonth() + 1
        const day = date.getDate()
        const weekday = weekdays[date.getDay()]
        
        dates.push({
          date: date.toISOString().split('T')[0],
          month: `${month}月`,
          day: day,
          weekday: weekday
        })
      }
      
      this.availableDates = dates
    },
    async getAvailableSlots() {
      if (!this.selectedStore || !this.selectedDate) return
      
      try {
        const response = await axios.get(`/api/appointment/available-slots/${this.selectedStore}`, {
          params: { date: this.selectedDate }
        })
        this.availableSlots = response.data
        this.selectedTimeSlot = null
        this.selectedTimeSlotText = ''
      } catch (error) {
        console.error('获取可预约时间段失败:', error)
      }
    },
    toggleProject(projectId) {
      const index = this.selectedProjects.indexOf(projectId)
      if (index > -1) {
        this.selectedProjects.splice(index, 1)
      } else {
        this.selectedProjects.push(projectId)
      }
    },
    selectStore(storeId) {
      this.selectedStore = storeId
    },
    selectTechnician(technicianId) {
      this.selectedTechnician = technicianId
    },
    selectDate(date) {
      this.selectedDate = date
      this.getAvailableSlots()
    },
    selectTimeSlot(slotId, slotText) {
      this.selectedTimeSlot = slotId
      this.selectedTimeSlotText = slotText
    },
    nextStep() {
      if (this.step < 4) {
        this.step++
      }
    },
    prevStep() {
      if (this.step > 1) {
        this.step--
      }
    },
    async submitBooking() {
      if (!this.customerName || !this.customerPhone) {
        alert('请填写联系信息')
        return
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.customerPhone)) {
        alert('请输入正确的手机号')
        return
      }
      
      try {
        const response = await axios.post('/api/appointment', {
          store_id: this.selectedStore,
          technician_id: this.selectedTechnician,
          project_ids: this.selectedProjects.join(','),
          appointment_date: this.selectedDate,
          time_slot: this.selectedTimeSlotText,
          customer_name: this.customerName,
          customer_phone: this.customerPhone
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        alert('预约成功')
        this.$router.push('/appointments')
      } catch (error) {
        console.error('提交预约失败:', error)
        alert('预约失败，请稍后重试')
      }
    }
  }
}
</script>
