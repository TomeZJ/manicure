const {
  User,
  Admin,
  Project,
  Technician,
  Store,
  TimeSlot,
  Appointment,
} = require("./models");
const sequelize = require("./config/database");
const bcrypt = require("bcryptjs");

// 数据填充函数
async function seedData() {
  try {
    console.log("开始填充数据...");

    // 同步数据库表结构
    console.log("同步数据库表结构...");
    await sequelize.sync({ force: true });
    console.log("数据库表结构同步成功");

    // 2. 创建管理员数据
    console.log("创建管理员数据...");
    const adminPassword = await bcrypt.hash("123456", 10);
    const admin = await Admin.create({
      username: "admin",
      password: adminPassword,
      name: "管理员",
    });
    console.log(`创建管理员: ${admin.username}`);

    // 3. 创建项目数据
    console.log("创建项目数据...");
    const projects = await Project.bulkCreate([
      {
        name: "纯色美甲",
        category: "纯色",
        price: 88,
        duration: 30,
        image:
          "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=manicure%20solid%20color%20nails&image_size=square",
        description: "纯色美甲，多种颜色可选",
        status: "active",
      },
      {
        name: "款式美甲",
        category: "款式",
        price: 168,
        duration: 60,
        image:
          "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=manicure%20design%20nails&image_size=square",
        description: "时尚款式美甲，个性定制",
        status: "active",
      },
      {
        name: "甲片延长",
        category: "延长",
        price: 228,
        duration: 90,
        image:
          "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=manicure%20nail%20extensions&image_size=square",
        description: "甲片延长，增加指甲长度",
        status: "active",
      },
      {
        name: "手部护理",
        category: "护理",
        price: 98,
        duration: 45,
        image:
          "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hand%20care%20manicure&image_size=square",
        description: "手部护理，滋润保湿",
        status: "active",
      },
      {
        name: "脚部护理",
        category: "护理",
        price: 128,
        duration: 60,
        image:
          "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=foot%20care%20pedicure&image_size=square",
        description: "脚部护理，舒缓疲劳",
        status: "active",
      },
    ]);
    console.log(`创建项目: ${projects.length} 个`);

    // 4. 创建门店数据
    console.log("创建门店数据...");
    const stores = await Store.bulkCreate([
      {
        name: "美甲店1",
        address: "北京市朝阳区三里屯",
        phone: "13800138001",
        opening_hours: "10:00-20:00",
      },
      {
        name: "美甲店2",
        address: "上海市静安区南京西路",
        phone: "13900139001",
        opening_hours: "10:00-21:00",
      },
    ]);
    console.log(`创建门店: ${stores.length} 个`);

    // 5. 创建技师数据
    console.log("创建技师数据...");
    const technicians = await Technician.bulkCreate([
      {
        name: "技师1",
        avatar:
          "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20manicure%20technician%20portrait&image_size=square",
        skills: "纯色、款式",
        status: "available",
        store_id: stores[0].id,
      },
      {
        name: "技师2",
        avatar:
          "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20manicure%20technician%20portrait&image_size=square",
        skills: "延长、护理",
        status: "available",
        store_id: stores[0].id,
      },
      {
        name: "技师3",
        avatar:
          "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20manicure%20technician%20portrait&image_size=square",
        skills: "款式、延长",
        status: "available",
        store_id: stores[1].id,
      },
    ]);
    console.log(`创建技师: ${technicians.length} 个`);

    // 6. 创建时间段数据
    console.log("创建时间段数据...");
    const timeSlots = [];
    const hours = Array.from({ length: 11 }, (_, i) => i + 10); // 10:00-20:00

    for (const store of stores) {
      for (const hour of hours) {
        timeSlots.push({
          store_id: store.id,
          start_time: `${hour}:00`,
          end_time: `${hour + 1}:00`,
          max_capacity: 3,
        });
      }
    }

    await TimeSlot.bulkCreate(timeSlots);
    console.log(`创建时间段: ${timeSlots.length} 个`);

    // 7. 创建用户数据（可选）
    console.log("创建用户数据...");
    const users = await User.bulkCreate([
      {
        phone: "13812345678",
        name: "用户1",
        avatar: "",
      },
      {
        phone: "13987654321",
        name: "用户2",
        avatar: "",
      },
    ]);
    console.log(`创建用户: ${users.length} 个`);

    // 8. 创建预约数据（可选）
    console.log("创建预约数据...");
    const today = new Date().toISOString().split("T")[0];
    const appointments = await Appointment.bulkCreate([
      {
        user_id: users[0].id,
        store_id: stores[0].id,
        technician_id: technicians[0].id,
        project_ids: "1,2",
        appointment_date: today,
        time_slot: "10:00-11:00",
        customer_name: "用户1",
        customer_phone: "13812345678",
        status: "pending",
      },
      {
        user_id: users[1].id,
        store_id: stores[1].id,
        technician_id: technicians[2].id,
        project_ids: "3",
        appointment_date: today,
        time_slot: "14:00-15:00",
        customer_name: "用户2",
        customer_phone: "13987654321",
        status: "pending",
      },
    ]);
    console.log(`创建预约: ${appointments.length} 个`);

    console.log("数据填充完成！");
  } catch (error) {
    console.error("数据填充失败:", error);
  }
}

// 执行数据填充
seedData();
