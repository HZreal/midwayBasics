import {
  Inject,
  Controller,
  Post,
  Provide,
  Query,
  ServerlessTrigger,
  ServerlessTriggerType,
} from '@midwayjs/decorator';
import { Context } from 'egg';
import { IGetUserResponse } from '../interface';
import { UserService } from '../service/user';

@Provide()
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/get_user')
  async getUser(@Query() uid: string): Promise<IGetUserResponse> {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }
}

// 获取上传后的文件
@Provide()
export class IndexHandler {
  @Inject()
  ctx;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/upload',
    method: 'post',
  })
  async handler() {
    const files = (this.ctx as any).files;
    console.log(files);

    /*
    files = [
        {
        filename: "20210118142906.jpg",
        data: FileReadStream, // 还支持其他模式，参照配置中的 mod 参数
        fieldname: "fileFormName",
        mimeType: "image/jpeg"
      }
    ]
    */
    const fields = (this.ctx as any).fields;
    console.log(fields);

    /*
    fields = {
            formKey: formValue
        }
    */
  }
}
