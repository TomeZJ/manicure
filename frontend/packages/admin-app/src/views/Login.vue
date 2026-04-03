<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary mb-2">美甲预约系统</h1>
          <p class="text-gray-600">管理员登录</p>
        </div>
        
        <a-form :model="form" @submit.prevent="handleLogin" class="space-y-6">
          <a-form-item label="用户名">
            <a-input v-model:value="form.username" placeholder="请输入用户名" />
          </a-form-item>
          
          <a-form-item label="密码">
            <a-input-password v-model:value="form.password" placeholder="请输入密码" />
          </a-form-item>
          
          <a-form-item>
            <a-button type="primary" html-type="submit" class="w-full">
              登录
            </a-button>
          </a-form-item>
        </a-form>
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
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      if (!this.form.username || !this.form.password) {
        this.$message.error('请输入用户名和密码')
        return
      }
      
      try {
        const response = await axios.post('/api/admin/login', this.form)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('admin', JSON.stringify(response.data.admin))
        this.$router.push('/dashboard')
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error('登录失败，请检查用户名和密码')
      }
    }
  }
}
</script>
