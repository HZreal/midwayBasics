import { App, Configuration } from '@midwayjs/decorator';
import {
  ILifeCycle,
  IMidwayApplication,
  IMidwayContainer,
} from '@midwayjs/core';
import * as swagger from '@midwayjs/swagger';
import * as orm from '@midwayjs/orm';
import * as view from '@midwayjs/view-ejs';
import * as redis from '@midwayjs/redis';
import { Application } from 'egg';
import { join } from 'path';
// import * as Upload from '@midwayjs/faas-middleware-upload';
// import * as typegoose from '@midwayjs/typegoose';
// import * as ClickHouse from '@apla/clickhouse';
// import { clickhouseConfig } from './config/config.default';

@Configuration({
  imports: [
    // Upload, // Faas文件上传
    orm,
    swagger,
    // typegoose, // 加载 typegoose 组件
    view, // 导入 ejs 组件
    redis, // 导入 redis 组件
  ],
  importConfigs: [join(__dirname, './config')],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  // @Inject()
  // db: ClickHouse;

  /**
   * 在应用 ready 的时候执行
   * @param container IoC 容器
   * @param app 应用 app
   */
  async onReady(
    container: IMidwayContainer,
    app: IMidwayApplication
  ): Promise<void> {
    // 在应用启动时建立数据库连接，而不是在请求响应时再去创建
    // this.db = new ClickHouse(clickhouseConfig);
    // const clickhouseClient = new ClickHouse(clickhouseConfig);
    // console.log("----clickhouseClient----", clickhouseClient)
    // 对默认注入的对象做扩充
    // container.registerObject('clickhouseClient', clickhouseClient);
    // const env = process.env
    // console.log("程序执行环境------", env)

    // faas文件上传
    // const uploadMW = await this.app.generateMiddleware(Upload.Upload);
    // this.app.use(uploadMW);
  }

  /**
   * 在应用配置加载后执行
   */
  onConfigLoad?(
    container: IMidwayContainer,
    app: IMidwayApplication
  ): Promise<void>;

  /**
   * 在应用停止的时候执行
   * @param container IoC 容器
   * @param app 应用 app
   */
  onStop?(container: IMidwayContainer, app: IMidwayApplication): Promise<void>;
}

// 引入ORM
// @Configuration({
//   imports: [orm],
//   importConfigs: [join(__dirname, './config')],
// })
// export class ORMContainerConfiguration {}

// 引入Swagger
// @Configuration({
//   imports: [swagger],
// })
// export class SwaggerContainerConfiguration {}

// mongodb
// @Configuration({
//   imports: [
//     typegoose, // 加载 typegoose 组件
//   ],
//   importConfigs: [join(__dirname, './config')],
// })
// export class MongodbContainerConfiguration {}

// view-ejs
// @Configuration({
//   imports: [
//     view, // 导入 ejs 组件
//   ],
//   importConfigs: [join(__dirname, 'config')],
// })
// export class ViewEjsContainerConfiguration {}
