module.exports = {
  apps: [
    {
      name: 'nms-prod',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'redis-prod',
      script: 'redis-server',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
