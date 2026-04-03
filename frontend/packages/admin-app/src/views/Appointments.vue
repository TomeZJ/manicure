<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">预约管理</h1>

    <!-- 筛选条件 -->
    <a-card class="mb-6">
      <a-form :model="searchForm" layout="inline">
        <a-form-item label="日期">
          <a-date-picker v-model:value="searchForm.date" format="YYYY-MM-DD" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchForm.status" placeholder="选择状态">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="pending">待服务</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
            <a-select-option value="cancelled">已取消</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="门店">
          <a-select v-model:value="searchForm.store_id" placeholder="选择门店">
            <a-select-option value="">全部</a-select-option>
            <a-select-option
              v-for="store in stores"
              :key="store.id"
              :value="store.id"
              >{{ store.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="search">查询</a-button>
          <a-button @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 预约列表 -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="appointments"
        :pagination="{ pageSize: 10 }"
      >
        <template #column:status="{ record }">
          <a-tag :color="getStatusColor(record.status)">{{
            getStatusText(record.status)
          }}</a-tag>
        </template>
        <template #column:action="{ record }">
          <a-button type="link" @click="viewAppointment(record.id)"
            >查看</a-button
          >
          <a-button
            type="link"
            v-if="record.status === 'pending'"
            @click="updateStatus(record.id, 'completed')"
            >完成</a-button
          >
          <a-button
            type="link"
            v-if="record.status === 'pending'"
            @click="updateStatus(record.id, 'cancelled')"
            >取消</a-button
          >
          <a-button type="link" danger @click="deleteAppointment(record.id)"
            >删除</a-button
          >
        </template>
      </a-table>
    </a-card>

    <!-- 预约详情模态框 -->
    <a-modal v-model:open="detailModalVisible" title="预约详情" width="800px">
      <div v-if="selectedAppointment" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-medium mb-2">基本信息</h3>
            <p>
              <span class="text-gray-600">预约编号：</span
              >{{ selectedAppointment.id }}
            </p>
            <p>
              <span class="text-gray-600">客户姓名：</span
              >{{ selectedAppointment.customerName }}
            </p>
            <p>
              <span class="text-gray-600">联系电话：</span
              >{{ selectedAppointment.customerPhone }}
            </p>
            <p>
              <span class="text-gray-600">预约时间：</span
              >{{ selectedAppointment.appointmentDate }}
              {{ selectedAppointment.timeSlot }}
            </p>
            <p>
              <span class="text-gray-600">门店：</span
              >{{ selectedAppointment.store?.name }}
            </p>
            <p>
              <span class="text-gray-600">技师：</span
              >{{ selectedAppointment.technician?.name || "随机安排" }}
            </p>
            <p>
              <span class="text-gray-600">状态：</span>
              <a-tag :color="getStatusColor(selectedAppointment.status)">{{
                getStatusText(selectedAppointment.status)
              }}</a-tag>
            </p>
          </div>
          <div>
            <h3 class="font-medium mb-2">预约项目</h3>
            <div
              v-for="project in selectedAppointment.projects"
              :key="project.id"
              class="border-b border-gray-100 py-2"
            >
              <p class="font-medium">{{ project.name }}</p>
              <p class="text-sm text-gray-600">
                ¥{{ project.price }} | {{ project.duration }}分钟
              </p>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Appointments",
  data() {
    return {
      appointments: [],
      stores: [],
      searchForm: {
        date: null,
        status: "",
        store_id: "",
      },
      detailModalVisible: false,
      selectedAppointment: null,
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
          key: "time",
          render: (_, record) => `${record.appointmentDate} ${record.timeSlot}`,
        },
        {
          title: "门店",
          key: "store",
          render: (_, record) => record.store?.name || "",
        },
        {
          title: "技师",
          key: "technician",
          render: (_, record) => record.technician?.name || "随机安排",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  mounted() {
    this.getAppointments();
    this.getStores();
  },
  methods: {
    async getAppointments() {
      try {
        const params = {};
        if (this.searchForm.date) {
          params.date = this.searchForm.date.format("YYYY-MM-DD");
        }
        if (this.searchForm.status) {
          params.status = this.searchForm.status;
        }
        if (this.searchForm.store_id) {
          params.store_id = this.searchForm.store_id;
        }

        const response = await axios.get("/api/appointment/admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params,
        });
        this.appointments = response.data;
      } catch (error) {
        console.error("获取预约列表失败:", error);
      }
    },
    async getStores() {
      try {
        const response = await axios.get("/api/store");
        this.stores = response.data;
      } catch (error) {
        console.error("获取门店列表失败:", error);
      }
    },
    search() {
      this.getAppointments();
    },
    reset() {
      this.searchForm = {
        date: null,
        status: "",
        store_id: "",
      };
      this.getAppointments();
    },
    async viewAppointment(id) {
      try {
        const response = await axios.get(`/api/appointment/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.selectedAppointment = response.data;
        this.detailModalVisible = true;
      } catch (error) {
        console.error("获取预约详情失败:", error);
      }
    },
    async updateStatus(id, status) {
      try {
        await axios.put(
          `/api/appointment/${id}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        this.$message.success("状态更新成功");
        this.getAppointments();
      } catch (error) {
        console.error("更新状态失败:", error);
        this.$message.error("更新状态失败");
      }
    },
    async deleteAppointment(id) {
      if (confirm("确定要删除这个预约吗？")) {
        try {
          await axios.delete(`/api/appointment/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          this.$message.success("删除成功");
          this.getAppointments();
        } catch (error) {
          console.error("删除预约失败:", error);
          this.$message.error("删除失败");
        }
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
  },
};
</script>
