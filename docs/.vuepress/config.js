module.exports = {
  title: '小惠喜欢常富',
  description: '始终坚信努力可以改变生活',
  // 主题配置
  themeConfig: {
    nextLinks: true, // 下一篇
    prevLinks: true, // 上一篇
    sidebar: 'auto', // 自动生成侧边栏
    sidebarDepth: 4, // 侧边栏显示4级
    // 搜索框右侧的内容配置
    nav: [
      { text: '首页', link: '/' },
      { text: '算法笔记', link: '/algorithm' },
      { text: 'Node笔记', link: '/node' },
      { text: '正则(RegExp)笔记', link: '/regexp' },
      { text: 'Typescript笔记', link: '/typescript' },
      {
        text: "框架笔记", items: [
          { text: 'Vue2笔记', link: '/vue2' },
          { text: 'Vue3笔记', link: '/vue3' },
          { text: 'React笔记', link: '/react' },
          { text: 'Dva笔记', link: '/dva' },
          { text: 'Umi笔记', link: '/umi' },
        ]
      },
      {
        text: "构建笔记", items: [
          { text: 'Webpack笔记', link: '/webpack5' }
        ]
      },
      {
        text: "数据库笔记", items: [
          { text: 'Mysql笔记', link: '/mysql' }
        ]
      },
      {
        text: "运维部署笔记", items: [
          { text: 'Linux笔记', link: '/linux' },
          { text: 'Nginx笔记', link: '/nginx' }
        ]
      },
      { text: '个人github', link: 'https://github.com/Zheng-Changfu', target: '_blank' },
    ],
    smoothScroll: true, // 开启滚动效果
  },
}