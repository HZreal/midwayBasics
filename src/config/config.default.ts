// 项目配置
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1659968680215_6743';

  // add your config here
  // 全局注册中间件
  //config.middleware = ['reportMiddleware3'];

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };

  // 跨域指定特定域名
  config.security = {
    csrf: false,
    // domainWhiteList: ['http://localhost:4200'], //  允许跨域的域名
  };

  // 文件上传
  config.multipart = {
    // mode: 'file', // 还有stream方式
    mode: 'stream',
    // fileSize: '50mb',

    // fileExtensions: ['.txt', '.apk'], // 已有的白名单上进行扩展
    whitelist: ['.txt', '.jpg'], // 将会覆盖白名单，且定义的fileExtensions会被忽略
  };

  // faas文件上传
  // 仅适用于 Serverless 环境，小于 6M 的文件上传到函数端，进行文件相关处理操作。
  // config.upload = {
  //   mod: 'stream',        // 三种模式，默认为 stream，即流式，还支持 buffer 和 file 两种配置
  // }

  // config.orm = {
  // default: {
  //   type: 'mysql', // mysql, mariadb, postgres, cockroachdb, sqlite, mssql, oracle, cordova, nativescript, react-native, expo, or mongodb
  //   host: '127.0.0.1',
  //   port: 3306,
  //   username: 'root',
  //   password: 'root123456',
  //   database: 'test',
  //   synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
  //   logging: false,
  //   // timezone: '+08:00',     // 默认是utc时间，与北京时间差8h
  // },
  // sqlite: {
  //   type: 'sqlite',
  //   database: join(__dirname, '../../midway_test.sqlite'),
  //   logging: true,
  // },
  // pg: {
  //   type: 'postgres',
  //   host: '192.168.28.133',
  //   port: 5432,
  //   username: 'huang',
  //   password: 'root123456',
  //   database: 'huang',
  //   synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true
  //   logging: false,
  //   // timezone: '+08:00',     // 默认是utc时间，与北京时间差8h
  // },
  // };

  // mongo 配置
  // config.mongoose = {
  //   client: {
  //     uri: 'mongodb://192.168.1.7:27017/test',
  //     options: {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       user: '',
  //       pass: '',
  //     },
  //   },
  // };

  // Redis
  // config.redis = {
  //   client: {
  //     port: 6379, // Redis port
  //     host: '192.168.19.128', // Redis host
  //     // password: 'auth',
  //     // db: 0,
  //   },
  // };

  // config.clickhouseConfig = {
  //   host: '192.168.19.128',
  //   port: 8123,
  //   user: 'default',
  //   password: 'root123456',
  //   // dataObjects: true,        // 返回的行以{fieldName: fieldValue}形式
  //   // format: 'JSON'
  //   // queryOptions: {
  //   //     database: 'test',
  //   // },
  // };

  return config;
};

// Egg.js 中默认的 bodyparer 库为 koa-bodyparser , 这里覆盖框架的默认配置
// export const bodyParser = {
//   jsonLimit: '1mb',
// }

// 配置 cors 插件
// export const cors = {
//   // {string|Function} origin: '*',
//   // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
// };

// Faas文件上传
// export const upload = {
//   mod: 'stream',        // 三种模式，默认为 stream，即流式，还支持 buffer 和 file 两种配置
// };

// mongo 配置
// export const mongoose = {
//   client: {
//     uri: 'mongodb://192.168.1.7:27017/test',
//     options: {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       user: '',
//       pass: '',
//     },
//   },
// };

// view ejs
export const view = {
  defaultViewEngine: 'ejs',
  mapping: {
    '.ejs': 'ejs',
  },
};

// ejs config
export const ejs = {};
