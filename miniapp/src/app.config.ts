export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/favorites/index',
    'pages/mine/index',
    'pages/tool/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '工具箱',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#3b82f6',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '工具',
        iconPath: 'assets/tabbar/tools.png',
        selectedIconPath: 'assets/tabbar/tools-selected.png',
      },
      {
        pagePath: 'pages/favorites/index',
        text: '收藏',
        iconPath: 'assets/tabbar/favorites.png',
        selectedIconPath: 'assets/tabbar/favorites-selected.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/tabbar/mine.png',
        selectedIconPath: 'assets/tabbar/mine-selected.png',
      },
    ],
  },
});
