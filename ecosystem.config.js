module.exports = {
  apps: [
    {
      name: 'manicure-api',
      script: './app.js',
      cwd: './backend',

      // 实例数量：集群模式，根据 CPU 核心数自动设置
      instances: 'max',
      exec_mode: 'cluster',

      // 自动重启配置
      watch: false,           // 生产环境建议关闭 watch
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '500M',  // 内存超过 500M 自动重启
      exp_backoff_restart_delay: 100,  // 重启延迟指数退避

      // 环境变量
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },

      // 日志配置
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,

      // 优雅关闭
      kill_timeout: 5000,
      wait_ready: false,
      listen_timeout: 3000,

      // 定时重启（可选，每天凌晨 3 点重启）
      // cron_restart: '0 3 * * *',
    }
  ],

  // 部署配置（可选）
  deploy: {
    production: {
      user: 'your-user',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/manicure.git',
      path: '/var/www/manicure',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt-get install git -y'
    }
  }
};