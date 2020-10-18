module.exports = {
  apps : [{
    script: 'src/index.js',
    watch: '.'
  }],
  deploy: {
    production: {
      user: 'slon',
      host: '45.141.100.17',
      ref: 'origin/main',
      repo: 'git@github.com:r72cccp/slack-chat-decorator.git',
      path: '/home/slon/projects/slack-chat-decorator',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
