import { Controller, Get, Post, Put, Provide } from '@midwayjs/decorator';

@Provide()
// 参数为路由前缀（分组）
@Controller('/')
export class HomeController {
  @Get('/')
  async home() {
    return 'Hello Midwayjs!';
  }

  @Post('/create')
  async createData() {
    return 'This is a post method';
  }

  @Put('/update')
  async updateData() {
    return 'This is a post method';
  }

  @Get('/hello1')
  @Get('/hello2')
  async hello() {
    return 'index page';
  }
}
