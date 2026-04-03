<template>
  <div class="min-h-screen bg-light">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4 flex items-center">
        <router-link to="/projects" class="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <h1 class="text-xl font-bold">项目详情</h1>
      </div>
    </header>

    <!-- 项目详情 -->
    <main class="container mx-auto px-4 py-6">
      <div v-if="project" class="space-y-6">
        <!-- 项目图片 -->
        <div class="bg-white rounded-xl overflow-hidden">
          <img :src="project.cover_image" :alt="project.name" class="w-full h-64 object-cover" />
        </div>

        <!-- 项目信息 -->
        <div class="bg-white rounded-xl p-5">
          <h2 class="text-xl font-bold mb-2">{{ project.name }}</h2>
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <span class="bg-gray-100 px-3 py-1 rounded-full mr-3">{{ project.category }}</span>
            <span class="mr-3">{{ project.duration }}分钟</span>
          </div>
          <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-primary">¥{{ project.price }}</span>
            <button @click="addToBooking" class="btn-primary">
              立即预约
            </button>
          </div>
          <div class="border-t border-gray-100 pt-4">
            <h3 class="font-medium mb-2">项目介绍</h3>
            <p class="text-gray-600">{{ project.description }}</p>
          </div>
        </div>
      </div>
      <div v-else class="flex justify-center items-center py-20">
        <p class="text-gray-500">加载中...</p>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProjectDetail',
  data() {
    return {
      project: null
    }
  },
  mounted() {
    this.getProjectDetail()
  },
  methods: {
    async getProjectDetail() {
      try {
        const response = await axios.get(`/api/project/${this.$route.params.id}`)
        this.project = response.data
      } catch (error) {
        console.error('获取项目详情失败:', error)
      }
    },
    addToBooking() {
      // 将项目ID存储到本地存储，以便预约页面使用
      localStorage.setItem('bookingProjectId', this.project.id)
      this.$router.push('/booking')
    }
  }
}
</script>
