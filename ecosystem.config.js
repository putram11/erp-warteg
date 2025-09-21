module.exports = {
  apps: [
    {
      name: 'erp-warteg-backend',
      script: './backend/src/server.js',
      cwd: '/app',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: '/app/logs/backend-error.log',
      out_file: '/app/logs/backend-out.log',
      log_file: '/app/logs/backend-combined.log',
      time: true
    },
    {
      name: 'erp-warteg-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/app/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: '/app/logs/frontend-error.log',
      out_file: '/app/logs/frontend-out.log',
      log_file: '/app/logs/frontend-combined.log',
      time: true
    }
  ]
};
