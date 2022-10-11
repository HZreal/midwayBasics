import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';




// 定义中间件
@Provide()
export class ReportMiddleware implements IWebMiddleware {    // 这个中间件类的 key 为 reportMiddleware
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {

      // 控制器前执行的逻辑
      console.log('enter ReportMiddleware');

      // 执行下一个 Web 中间件，最后执行到控制器
      await next();

      // 控制器之后执行的逻辑
      console.log('exit ReportMiddleware');
    };
  }
}


@Provide()
export class ReportMiddleware2 implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      console.log('enter ReportMiddleware2');

      await next();

      console.log('exit ReportMiddleware2');
    };
  }
}


@Provide()
export class ReportMiddleware3 implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      // 这里获取了 body 数据
      console.log(ctx.request.body);
      await next();
    };
  }
}
