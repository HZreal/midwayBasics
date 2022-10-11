import { UserDTO } from './../dto/user';
import { Context } from 'egg';
import {
  Controller,
  Provide,
  Get,
  Query,
  ALL,
  Post,
  Body,
  Param,
  RequestPath,
  RequestIP,
  HttpCode,
  SetHeader,
  Redirect,
  ContentType,
  Inject,
  Validate,
  File,
  Files,
} from '@midwayjs/decorator';
import { User, User2 } from '../interface';
import { TestTypegooseUserService, UserService2 } from '../service/user';
import { CreateApiDoc } from '@midwayjs/swagger';
import { getConnection, Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/orm';
import { PostgreTestUser } from '../modelEntity/user';
import { CommonRedisService } from '../service/commom/redis';
import { CommonClickhouseService } from '../service/commom/clickhouse';
import { createWriteStream} from "fs";

@Provide()
@Controller('/api/user')
export class UserController {
  // 查询参数
  // @Get('/getUser')
  // async getUser(@Query() id: string): Promise<User> {}

  @Get('/getUser0')
  async getUser0(@Query() id: string) {
    console.log(id);
    return 'id ---->  ' + id;
  }

  // URL = /?id=1
  @Get('/getUser1')
  async getUser1(@Query('id') uid: string) {
    console.log(uid);
    return 'uid ----->  ' + uid;
  }

  @Get('/getUser2')
  async getUser2(@Query(ALL) queryObject: object) {
    console.log(queryObject);
    return 'get all query params';
  }

  // body参数
  // @Post('/')
  // async updateUser(@Body() id: string): Promise<User> {}

  @Post('/createUser')
  // async createUser(@Body() id: string) {}
  async createUser(@Body(ALL) user: User, @Query() page: number) {
    console.log(user);
    console.log(page);
    return 'user info from body';
  }

  // url参数
  @Get('/:uid')
  async findUser(@Param() uid: string) {
    // uid 从路由参数中获取
  }

  // 获取 body 、path 和 ip
  @Post('/infoInEnv')
  async updateUser(
    @Body() id: string,
    @RequestPath() path: string,
    @RequestIP() ip: string
  ) {
    return id + path + ip;
  }

  // 参数校验(一般方式，在controller中，业务逻辑之前)
  @Post('/validateParams')
  async validateParams(@Body(ALL) user: User2) {
    if (!user.id || typeof user.id !== 'number') {
      throw new Error('id error');
    }

    if (user.age <= 30) {
      throw new Error('age not match');
    }

    console.log('validated user', user);
    return { msg: 'validate success !' };
  }

  // 参数校验(使用规则检查，需要创建数据DTO)
  @Post('/validateParams2')
  @Validate()
  async validateParams2(@Body(ALL) user: UserDTO) {
    console.log('validated user', user);
    return { msg: 'validate success !' };
  }

  // 状态码
  @Get('/statusCode')
  @HttpCode(201) // 返回状态码
  @SetHeader('x-aaa', 'aaa123') // 设置头部
  @SetHeader({
    // 设置多个头部
    'x-bbb': '123',
    'x-ccc': '234',
  })
  async setCodeOrheader() {
    return 'Hello Midwayjs!';
  }

  // TODO 重定向
  @Get('/login_check')
  async check() {
    console.log(' check ');
    return 'check';
  }

  @Get('/login')
  @Redirect('/login_check')
  async login() {
    console.log(' login  ');
    return 'login';
  }

  @Get('/login_another')
  @Redirect('/login_check', 302)
  async loginAnother() {
    console.log(' login_check ');
    return 'login_check';
  }

  // 响应类型
  @Get('/indexPage')
  @ContentType('html')
  async indexPage() {
    return '<body>hello world</body>';
  }
}

// 注入服务
@Provide()
@Controller('/api/user2')
export class APIController2 {
  @Inject()
  userService: UserService2;

  @Get('/useService2')
  async getUser(@Query('id') uid) {
    const user = await this.userService.getUser(uid);
    console.log(user);
    return { code: 0, message: 'OK', data: user };
  }
}

// 路由中间件(在Controller或者请求方式中设置)
@Provide()
@Controller('/api/user3', { middleware: ['reportMiddleware'] }) // 数组中为中间件名称，默认为类名的驼峰形式
export class APIController3 {
  @Inject()
  userService: UserService2;

  @Get('/useMiddleware')
  async getUser(@Query('id') uid) {
    console.log('enter Controller');
    const user = await this.userService.getUser(uid);
    return { code: 0, message: 'OK', data: user };
  }

  @Get('/useMiddleware2', { middleware: ['reportMiddleware2'] })
  async getUser2(@Query('id') uid) {
    console.log('enter Controller');
    const user = await this.userService.getUser(uid);
    return { code: 0, message: 'OK', data: user };
  }
}

// 全局中间件
// 对所有的路由生效，设置全局中间件需要拿到应用的实例，同时，需要在所有请求之前被加载
// 全局配置src/config/config.default.ts 中设置config.middleware = ['reportMiddleware'];

// cookies
// 在 @midwayjs/web 使用
@Provide()
@Controller('/api/user4')
export class APIController4 {
  @Inject()
  ctx: Context;

  @Get('/useCookies')
  async getUser() {
    let count = this.ctx.cookies.get('count');
    console.log('get cookies ', count);

    this.ctx.cookies.set('token', 'qwertyuiop');

    return { code: 0, message: 'OK', data: 'user' };
  }
}

// session
// 在 @midwayjs/web 使用
@Provide()
@Controller('/api/user5')
export class APIController5 {
  @Inject()
  ctx: Context;

  @Get('/useSession')
  async getUser() {
    let userId = this.ctx.session.userId;
    console.log('get userId from session ', userId);

    // 设置
    this.ctx.session.userId = 1;

    // 清空
    // this.ctx.session = null;

    return { code: 0, message: 'OK', data: 'user' };
  }
}

// 文件上传
@Provide()
@Controller('/api/fileUpload')
export class FileUploadController {
  @Inject()
  ctx: Context;

  @Post('/test1')
  async parseUploadFile1(_ctx: Context) {
    console.log('============upload file===============');

    // https://blog.tcs-y.com/2020/03/06/midway-upload-image/
    console.log('-----------', _ctx)
    let part = await _ctx.multipart()

    console.log(part)

    // const parts = this.ctx.multipart();
    // console.log(
    //   '🚀 ~ file: user.ts ~ line 245 ~ FileUploadController ~ parseUploadFile ~ parts',
    //   parts
    // );

    // let part = await parts();
    // console.log(
    //   '🚀 ~ file: user.ts ~ line 250 ~ FileUploadController ~ parseUploadFile ~ part',
    //   part
    // );

    // const b = this.ctx.request.files;
    // console.log(
    //   '🚀 ~ file: user.ts ~ line 249 ~ FileUploadController ~ parseUploadFile ~ b',
    //   b
    // );

    return { code: 0, msg: 'OK', data: 'data' };
  }

  @Post('/streamMode/getSingleFile')
  async getSingleFileWithStream() {
    console.log('============Stream模式 上传单个文件 ===============');
    // 1. 只支持上传一个文件。
    // 2. 上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。

    const fileStream = await this.ctx.getFileStream()
    console.log(fileStream)

    // 表单字段
    const fields = fileStream.fields
    console.log('form field obj ============', fields)

    // 上传文件名
    const filename = fileStream.filename
    console.log('filename ============', filename)

    //
    // writeFileSync(`./${filename}`, fileStream.toString())

    //
    // const readable = createReadStream('./test111.txt');
    const writeable = createWriteStream(`./${filename}`);
    fileStream.pipe(writeable);


    return { code: 0, msg: 'OK', data: 'Stream模式 上传单个文件' };
  }

  @Post('/streamMode/getMultiFile')
  async getMultiFileWithStream() {
    // https://www.eggjs.org/zh-CN/basics/controller#%E8%8E%B7%E5%8F%96%E4%B8%8A%E4%BC%A0%E7%9A%84%E6%96%87%E4%BB%B6
    console.log('============upload file===============');

    const part = await this.ctx.multipart()
    console.log(part)
    if(part.length){
      console.log('field: ' + part[0]);
      console.log('value: ' + part[1]);
      console.log('valueTruncated: ' + part[2]);
      console.log('fieldnameTruncated: ' + part[3]);
    }else {
      // if (!part.filename) {
      //   // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
      //   // 需要做出处理，例如给出错误提示消息
      //   return;
      // }
    }

    return { code: 0, msg: 'OK', data: 'data' };
  }

  @Post('/test3')
  async parseUploadFile3(@File() file) {
    console.log('============upload file===============');
    console.log(file)

    return { code: 0, msg: 'OK', data: 'data' };
  }

  @Post('/test4')
  async parseUploadFile4(@Files() files) {
    console.log('============upload file===============');
    console.log(files.filename)

    return { code: 0, msg: 'OK', data: 'data' };
  }

  @Post('/fileMode/getMultiFile')
  async getMultiFile() {
    // 使用egg方式的文件上传，从egg的context中获取
    console.log('===============file模式 =========================');

    const files = this.ctx.request.files;
    console.log('files -------------', files);

    for (const eachFile of files) {
      console.log('eachFile -------------', eachFile);

      let fileName = eachFile.filename;
      console.log('fileName------------', fileName);

      let fileTmpPath = eachFile.filepath;
      console.log('fileTmpPath------------', fileTmpPath);
    }

    return { msg: 'success !' };
  }


}

// Swagger
@Provide()
@Controller('/api/swagger')
export class SwaggerTestController {
  @CreateApiDoc()
    .summary(' use swaggerr ~~~~ ')
    .description('This is a open api for swagger test !!!')
    .build()
  @Get('/test')
  async useSwagger() {
    return { code: 0, message: 'OK', data: 'user' };
  }
}

// test postgres
@Provide()
@Controller('/api/postgre')
export class PostgreTestController {
  @InjectEntityModel(PostgreTestUser, 'pg')
  pgTestUserModel: Repository<PostgreTestUser>;

  @Get('/test')
  async usePostgre() {
    // 测试是否连接
    const conn = getConnection('pg');
    console.log(
      '-------postgre is connected?-----------------------------------',
      conn.isConnected
    );

    const user = await this.pgTestUserModel.findOne({ where: { id: 1 } });
    console.log(
      '🚀 ~ file: user.ts ~ line 261 ~ PostgreTestController ~ usePostgre ~ user',
      user
    );

    return { code: 0, message: 'OK', data: user };
  }
}

// test mongodb
// MongoDB Node.js driver:  https://www.mongodb.com/docs/drivers/node/current/

// typegoose github:  https://github.com/typegoose/typegoose
// typegoose doc:  https://typegoose.github.io/typegoose/docs/guides/quick-start-guide

// mongoose doc:  https://mongoosejs.com/docs/guide.html
// mongoose github:  https://github.com/Automattic/mongoose
@Provide()
@Controller('/api/mongodb')
export class MongodbTestController {
  @Inject()
  TypegooseMongodbUserService: TestTypegooseUserService;

  @Get('/test')
  async basicOper() {
    await this.TypegooseMongodbUserService.getTest();
    return { code: 0, message: 'OK', data: 'typegoose for mongodb' };
  }
}

// test redis
@Provide()
@Controller('/api/redis')
export class RedisTestController {
  @Inject()
  commonRedisService: CommonRedisService;

  @Get('/test')
  async setName() {
    await this.commonRedisService.invoke();
    return { code: 0, message: 'OK', data: 'redis' };
  }
}

// test clickhouse
@Provide()
@Controller('/api/clickhouse')
export class ClickhouseTestController {
  @Inject()
  commonClickhouseService: CommonClickhouseService;

  @Get('/test')
  async getData() {
    // const rows = await this.commonClickhouseService.selectLargeDataset()
    const rows = await this.commonClickhouseService.getArticleList();
    // const rows = await this.commonClickhouseService.getArticleList2()
    // const rows = await this.commonClickhouseService.insertWithStream()

    return { code: 0, message: 'OK', data: rows };
  }
}
