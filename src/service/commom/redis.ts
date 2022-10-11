import { Inject, Provide } from '@midwayjs/decorator';
import { RedisService, RedisServiceFactory } from '@midwayjs/redis';


@Provide()
export class CommonRedisService {
  @Inject()
  redisService: RedisService;

  @Inject()
  redisServiceFactory: RedisServiceFactory;

  async invoke() {
    await this.redisService.set('foo', 'bar');
    const result = await this.redisService.get('foo');
    console.log("🚀 ~ file: user.ts ~ line 39 ~ UserService3 ~ invoke ~ result", result)

    // result => bar
  }

  async instance_oper() {
    const redis1 = await this.redisServiceFactory.get('instance1');
    console.log("🚀 ~ file: redis.ts ~ line 23 ~ CommonRedisService ~ redis1", redis1)

    const redis2 = await this.redisServiceFactory.get('instance3');
    console.log("🚀 ~ file: redis.ts ~ line 25 ~ CommonRedisService ~ redis2", redis2)

    //...
  }

}
