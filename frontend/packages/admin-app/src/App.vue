<template>
  <div v-if="!isAuthenticated" class="min-h-screen">
    <router-view />
  </div>
  <a-layout v-else class="min-h-screen">
    <!-- 侧边栏 -->
    <a-layout-sider :width="200" style="background: #fff">
      <div class="logo p-4 text-center text-xl font-bold text-primary">
        美甲预约系统
      </div>
      <a-menu mode="inline" :selected-keys="[currentRoute]" class="border-r-0">
        <a-menu-item key="dashboard">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </template>
          <router-link to="/dashboard">控制台</router-link>
        </a-menu-item>
        <a-menu-item key="appointments">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </template>
          <router-link to="/appointments">预约管理</router-link>
        </a-menu-item>
        <a-menu-item key="projects">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </template>
          <router-link to="/projects">项目管理</router-link>
        </a-menu-item>
        <a-menu-item key="technicians">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </template>
          <router-link to="/technicians">技师管理</router-link>
        </a-menu-item>
        <a-menu-item key="stores">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </template>
          <router-link to="/stores">门店管理</router-link>
        </a-menu-item>
        <a-menu-item key="time-slots">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </template>
          <router-link to="/time-slots">时间设置</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 主内容 -->
    <a-layout>
      <!-- 顶部导航 -->
      <a-layout-header
        style="
          background: #fff;
          border-bottom: 1px solid #f0f0f0;
          padding: 0 24px;
        "
      >
        <div class="flex justify-end items-center h-full">
          <span class="mr-4">{{ adminName }}</span>
          <a-button type="text" @click="logout">退出登录</a-button>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content
        style="margin: 24px; padding: 24px; background: #fff; min-height: 280px"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      adminName: "",
      isAuthenticated: false,
    };
  },
  computed: {
    currentRoute() {
      return this.$route.name || "dashboard";
    },
  },
  mounted() {
    this.checkAuthStatus();
    // 监听路由变化，确保登录状态正确
    this.$router.beforeEach((to, from, next) => {
      this.checkAuthStatus();
      next();
    });
  },
  methods: {
    checkAuthStatus() {
      this.isAuthenticated = !!localStorage.getItem("token");
      this.updateAdminInfo();
    },
    updateAdminInfo() {
      const adminStr = localStorage.getItem("admin");
      if (adminStr) {
        const admin = JSON.parse(adminStr);
        this.adminName = admin.name;
      } else {
        this.adminName = "";
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      this.isAuthenticated = false;
      this.adminName = "";
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.logo {
  background: linear-gradient(135deg, #ff6b8b 0%, #8b5cf6 100%);
  color: white;
  text-align: center;
  font-size: 20px;
  padding: 16px;
}
.ant-menu-item-icon {
  width: 12px;
}
</style>
