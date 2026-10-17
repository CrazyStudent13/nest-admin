import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'nest-admin docs',
  description: 'Deployment and development notes for nest-admin',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Deploy', link: '/deploy-online/step' },
      { text: 'Auto Deploy', link: '/deploy-online/auto-deploy-overview' },
      { text: 'Dev', link: '/development-tips/partner' },
    ],

    sidebar: {
      '/deploy-online/': [
        {
          text: 'Online Deploy',
          items: [
            { text: 'Overview', link: '/deploy-online/step' },
            { text: 'MySQL', link: '/deploy-online/mysql' },
            { text: 'Redis', link: '/deploy-online/redis' },
            { text: 'PM2', link: '/deploy-online/pm2' },
            { text: 'Nginx', link: '/deploy-online/nginx' },
          ],
        },
        {
          text: 'Auto Deploy',
          items: [
            { text: 'Minimal Flow', link: '/deploy-online/auto-deploy-overview' },
            { text: 'Secrets', link: '/deploy-online/auto-deploy-secrets' },
            { text: 'Troubleshooting', link: '/deploy-online/auto-deploy-troubleshooting' },
            { text: 'Command Checklist', link: '/deploy-online/auto-deploy-checklist' },
          ],
        },
      ],
      '/development-tips/': [
        {
          text: 'Development',
          items: [
            { text: 'Collaboration', link: '/development-tips/partner' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/taozhi1010/nest-admin' },
    ],
  },
})
