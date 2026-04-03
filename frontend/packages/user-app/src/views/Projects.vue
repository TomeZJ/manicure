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
        <h1 class="text-xl font-bold">项目列表</h1>
      </div>
    </header>

    <!-- 分类筛选 -->
    <div class="bg-white shadow-sm sticky top-16 z-10 py-3">
      <div class="container mx-auto px-4 overflow-x-auto">
        <div class="flex space-x-4">
          <button 
            v-for="category in categories" 
            :key="category" 
            @click="selectCategory(category)"
            :class="['px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all', selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <!-- 项目列表 -->
    <main class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-2 gap-4">
        <div 
          v-for="project in filteredProjects" 
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
        <router-link to="/projects" class="flex flex-col items-center text-primary">
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
  name: 'Projects',
  data() {
    return {
      projects: [],
      categories: ['全部', '纯色', '款式', '延长', '护理'],
      selectedCategory: '全部'
    }
  },
  computed: {
    filteredProjects() {
      if (this.selectedCategory === '全部') {
        return this.projects
      }
      return this.projects.filter(project => project.category === this.selectedCategory)
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
    selectCategory(category) {
      this.selectedCategory = category
    },
    goToProjectDetail(id) {
      this.$router.push(`/project/${id}`)
    }
  }
}
</script>
