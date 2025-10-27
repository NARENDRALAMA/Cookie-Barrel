module.exports = {
  apps: [{
    name: 'cookie-barrel-api',
    script: './server.js',
    cwd: '/path/to/your/backend', // Update this path on your VPS
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
