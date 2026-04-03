<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">控制台</h1>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <a-card>
        <div class="text-center">
          <div class="text-3xl font-bold text-primary mb-2">
            {{ todayAppointments }}
          </div>
          <div class="text-gray-600">今日预约</div>
        </div>
      </a-card>
      <a-card>
        <div class="text-center">
          <div class="text-3xl font-bold text-orange-500 mb-2">
            {{ pendingAppointments }}
          </div>
          <div class="text-gray-600">待服务</div>
        </div>
      </a-card>
      <a-card>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-500 mb-2">
            {{ totalAppointments }}
          </div>
          <div class="text-gray-600">总订单</div>
        </div>
      </a-card>
    </div>

    <!-- 最近预约列表 -->
    <a-card title="最近预约" class="mb-6">
      <a-table
        :columns="columns"
        :data-source="recentAppointments"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{
              getStatusText(record.status)
            }}</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" @click="viewAppointment(record.id)">
              查看
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      todayAppointments: 0,
      pendingAppointments: 0,
      totalAppointments: 0,
      recentAppointments: [],
      columns: [
        {
          title: "预约编号",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "客户姓名",
          dataIndex: "customerName",
          key: "customerName",
        },
        {
          title: "联系电话",
          dataIndex: "customerPhone",
          key: "customerPhone",
        },
        {
          title: "预约时间",
          dataIndex: "appointmentDate",
          key: "appointmentDate",
          render: (_, record) => `${record.appointmentDate} ${record.timeSlot}`,
        },
        {
          title: "门店",
          dataIndex: "store",
          key: "store",
          render: (_, r) => r.store?.name || "",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
        },
        {
          title: "操作",
          key: "action",
        },
      ],
    };
  },
  mounted() {
    this.getDashboardData();
  },
  methods: {
    async getDashboardData() {
      try {
        // 获取预约统计数据
        const appointmentsResponse = await axios.get("/api/appointment/admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const appointments = appointmentsResponse.data;
        const today = new Date().toISOString().split("T")[0];

        this.totalAppointments = appointments.length;
        this.todayAppointments = appointments.filter(
          (app) => app.appointmentDate === today,
        ).length;
        this.pendingAppointments = appointments.filter(
          (app) => app.status === "pending",
        ).length;
        this.recentAppointments = appointments.slice(0, 5);
      } catch (error) {
        console.error("获取控制台数据失败:", error);
      }
    },
    getStatusText(status) {
      const statusMap = {
        pending: "待服务",
        completed: "已完成",
        cancelled: "已取消",
      };
      return statusMap[status] || status;
    },
    getStatusColor(status) {
      const colorMap = {
        pending: "orange",
        completed: "green",
        cancelled: "default",
      };
      return colorMap[status] || "default";
    },
    viewAppointment(id) {
      // 跳转到预约详情页面
      this.$router.push(`/appointments?id=${id}`);
    },
  },
};
</script>
