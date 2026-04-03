<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100"
  >
    <div class="w-full max-w-md px-4">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-10">
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text mb-3"
          >
            美甲预约系统
          </h1>
          <p class="text-gray-600">管理员登录</p>
        </div>

        <a-form :model="form" @submit.prevent="handleLogin" class="space-y-6">
          <a-form-item label="用户名">
            <a-input
              v-model:value="form.username"
              placeholder="请输入用户名"
              size="large"
            />
          </a-form-item>

          <a-form-item label="密码">
            <a-input-password
              v-model:value="form.password"
              placeholder="请输入密码"
              size="large"
            />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="w-full"
              size="large"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      if (!this.form.username || !this.form.password) {
        this.$message.error("请输入用户名和密码");
        return;
      }

      try {
        const response = await axios.post("/api/admin/login", this.form);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("登录失败:", error);
        this.$message.error("登录失败，请检查用户名和密码");
      }
    },
  },
};
</script>

<style scoped>
.bg-white {
  width: 30vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  background: #eee;
  padding: 16px;
  margin-top: 20vh;
}
.mb-10 {
  width: 100%;
}
.ant-form {
  width: 100%;
}
</style>
