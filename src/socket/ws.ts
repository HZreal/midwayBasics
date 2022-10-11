import {
  ContentType,
  Controller,
  Get,
  Inject,
  OnWSConnection,
  OnWSDisConnection,
  OnWSMessage,
  Provide,
  WSBroadCast,
  WSController,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/ws';
import * as koa from '@midwayjs/koa';
import * as http from 'http';
import { join } from 'path';
import { readFile } from 'fs';

@Provide()
@WSController()
export class HelloSocketController {
  @Inject()
  ctx: Context;

  @OnWSConnection()
  async onConnection(socket: Context, request: http.IncomingMessage) {
    console.log('a client connected -------');
    // console.log(request, socket);
    console.log(`namespace / got a connection ${this.ctx.readyState}`);
  }

  @OnWSMessage('message')
  async gotMessage1(data) {
    console.log('data from client ----------------', data);
    return data;
  }

  @OnWSMessage('news')
  @WSBroadCast()
  async gotMessage2(data) {
    return data;
  }

  @OnWSDisConnection()
  async disconnect(id: number) {
    console.log('disconnect ' + id);
  }
}





@Provide()
@Controller('/render')
export class IndexPageController {
  @Inject()
  ctx: koa.Context;

  @Get('/index1')
  async render1() {
    await this.ctx.render('hello.ejs', {
      data: 'world',
    });
  }

  @Get('/index2')
  async render2() {
    await this.ctx.render('ws_index.ejs');
  }

  @Get('/index3')
  async render3() {
    await this.ctx.render('socketio_index.ejs');
  }

  @Get('/index')
  @ContentType('html')
  async getIndex() {
    var data;
    console.log('--------------------------', __dirname);

    const pathStr = join(__dirname, '../', '/templates', 'ws_index.html')
    console.log("🚀 ~ file: ws.ts ~ line 90 ~ IndexPageController ~ getIndex ~ pathStr", pathStr)

    readFile('C:\\Users\\sizhong\\file\\nodejs\\midwayBasics\\my_midway_app\\src\\templates\\ws_index.html', (err, res) => {
      if (err) {
        console.log("🚀 ~ file: ws.ts ~ line 94 ~ IndexPageController ~ fs.readFile ~ err", err)
        data = '<body>response html error !!!</body>'
      }

      console.log("🚀 ~ file: ws.ts ~ line 93 ~ IndexPageController ~ readFile ~ res", res)
      data = res.toString()
      console.log("🚀 ~ file: ws.ts ~ line 100 ~ IndexPageController ~ readFile ~ data", data)
    })

    return data;
  }
}
