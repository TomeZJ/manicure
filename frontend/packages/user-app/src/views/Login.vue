<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-light to-primary/10">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-primary mb-2">美甲预约</h1>
        <p class="text-gray-600">欢迎回来，开始您的美丽之旅</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">手机号</label>
            <input 
              v-model="phone" 
              type="tel" 
              class="input" 
              placeholder="请输入手机号" 
              maxlength="11"
            />
          </div>
          
          <button type="submit" class="btn-primary w-full py-3 text-lg">
            登录 / 注册
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      phone: ''
    }
  },
  methods: {
    async handleLogin() {
      if (!this.phone) {
        alert('请输入手机号')
        return
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        alert('请输入正确的手机号')
        return
      }
      
      try {
        const response = await axios.post('/api/user/login', { phone: this.phone })
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        this.$router.push('/')
      } catch (error) {
        console.error('登录失败:', error)
        alert('登录失败，请稍后重试')
      }
    }
  }
}
</script>
