// 内存数据存储
const storage = {
  // 用户数据
  users: [],
  // 管理员数据
  admins: [
    {
      id: 1,
      username: 'admin',
      password: '$2a$10$e5X5y1N4P8a5u4B5c6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9', // 123456
      name: '管理员',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  // 项目数据
  projects: [
    {
      id: 1,
      name: '纯色美甲',
      category: '纯色',
      price: 88,
      duration: 30,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=manicure%20solid%20color%20nails&image_size=square',
      description: '纯色美甲，多种颜色可选',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: '款式美甲',
      category: '款式',
      price: 168,
      duration: 60,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=manicure%20design%20nails&image_size=square',
      description: '时尚款式美甲，个性定制',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: '甲片延长',
      category: '延长',
      price: 228,
      duration: 90,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=manicure%20nail%20extensions&image_size=square',
      description: '甲片延长，增加指甲长度',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: '手部护理',
      category: '护理',
      price: 98,
      duration: 45,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hand%20care%20manicure&image_size=square',
      description: '手部护理，滋润保湿',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: '脚部护理',
      category: '护理',
      price: 128,
      duration: 60,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=foot%20care%20pedicure&image_size=square',
      description: '脚部护理，舒缓疲劳',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  // 门店数据
  stores: [
    {
      id: 1,
      name: '美甲店1',
      address: '北京市朝阳区三里屯',
      phone: '13800138001',
      openingHours: '10:00-20:00',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: '美甲店2',
      address: '上海市静安区南京西路',
      phone: '13900139001',
      openingHours: '10:00-21:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  // 技师数据
  technicians: [
    {
      id: 1,
      name: '技师1',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20manicure%20technician%20portrait&image_size=square',
      skills: '纯色、款式',
      status: 'available',
      storeId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: '技师2',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20manicure%20technician%20portrait&image_size=square',
      skills: '延长、护理',
      status: 'available',
      storeId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: '技师3',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20manicure%20technician%20portrait&image_size=square',
      skills: '款式、延长',
      status: 'available',
      storeId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  // 时间段数据
  timeSlots: [],
  // 预约数据
  appointments: []
};

// 初始化时间段数据
const hours = Array.from({ length: 11 }, (_, i) => i + 10); // 10:00-20:00
storage.stores.forEach(store => {
  hours.forEach(hour => {
    storage.timeSlots.push({
      id: storage.timeSlots.length + 1,
      storeId: store.id,
      startTime: `${hour}:00`,
      endTime: `${hour + 1}:00`,
      maxCapacity: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
});

// 自增ID生成器
const generateId = (array) => {
  if (array.length === 0) return 1;
  return Math.max(...array.map(item => item.id)) + 1;
};

module.exports = {
  storage,
  generateId
};
