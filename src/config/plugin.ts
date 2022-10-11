import { EggPlugin } from 'egg';
export default {
  view: false, // 使用view-wjs时，这里需要关闭egg(@midwayjs/web) 场景下的view
  logrotator: false, // disable when use @midwayjs/logger

  // 启用or禁用静态文件功能
  static: false,
  // static: true,
  // 静态文件默认配置如下：
  // {
  //   prefix: '/public/',     // 表示 URL 路径前缀
  // dir: path.join(appInfo.baseDir, 'app/public'),     // 表示静态文件存放的位置
  // }
} as EggPlugin;

// 配置插件启用
// exports.cors = {
//   enable: true,
//   package: 'egg-cors',
// };
