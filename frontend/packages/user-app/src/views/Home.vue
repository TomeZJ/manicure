<template>
  <div class="min-h-screen bg-light">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-primary">美甲预约</h1>
        <div class="flex items-center space-x-4">
          <router-link to="/appointments" class="text-gray-600 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </router-link>
          <router-link to="/profile" class="text-gray-600 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </router-link>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 py-6">
      <!-- 品牌信息 -->
      <section class="mb-8">
        <div class="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
          <h2 class="text-2xl font-bold mb-2">欢迎光临美甲旗舰店</h2>
          <p class="mb-4">专业美甲服务，让您的指尖焕发魅力</p>
          <button @click="goToBooking" class="bg-white text-primary px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-all">
            立即预约
          </button>
        </div>
      </section>

      <!-- 热门项目 -->
      <section class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">热门项目</h2>
          <router-link to="/projects" class="text-primary text-sm">查看全部</router-link>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="project in hotProjects" 
            :key="project.id" 
            class="card cursor-pointer" 
            @click="goToProjectDetail(project.id)"
          >
            <img :src="project.cover_image" :alt="project.name" class="w-full h-40 object-cover rounded-lg mb-3" />
            <h3 class="font-medium mb-1">{{ project.name }}</h3>
            <div class="flex justify-between items-center">
              <span class="text-primary font-bold">¥{{ project.price }}</span>
              <span class="text-sm text-gray-500">{{ project.duration }}分钟</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 快速预约 -->
      <section>
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-xl font-bold mb-4">快速预约</h2>
          <button @click="goToBooking" class="btn-primary w-full py-3 text-lg">
            开始预约
          </button>
        </div>
      </section>
    </main>

    <!-- 底部导航 -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-md">
      <div class="flex justify-around py-3">
        <router-link to="/" class="flex flex-col items-center text-primary">
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
        <router-link to="/appointments" class="flex flex-col items-center text-gray-500 hover:text-primary">
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
  name: 'Home',
  data() {
    return {
      hotProjects: []
    }
  },
  mounted() {
    this.getHotProjects()
  },
  methods: {
    async getHotProjects() {
      try {
        const response = await axios.get('/api/project')
        this.hotProjects = response.data.slice(0, 4)
      } catch (error) {
        console.error('获取热门项目失败:', error)
      }
    },
    goToBooking() {
      this.$router.push('/booking')
    },
    goToProjectDetail(id) {
      this.$router.push(`/project/${id}`)
    }
  }
}
</script>
