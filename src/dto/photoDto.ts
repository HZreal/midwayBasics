import { Rule, RuleType } from '@midwayjs/decorator';

export class PhotoDTO {
  // @Rule  装饰器用于 修饰需要被校验的属性，它的参数为 RuleType 对象提供的校验规则的链式方法
  // RuleType 即为 joi 对象本身
  // joi 提供了非常多的校验类型，还可以对对象和数组中的字段做校验，还有例如字符串常用的 RuleType.string().email() ，以及 RuleType.string().pattern(/xxxx/)  正则校验等
  @Rule(RuleType.number())
  id: number;

  @Rule(RuleType.string())
  name: string;

  @Rule(RuleType.string().max(512))
  description: string;

  @Rule(RuleType.string().required())
  filename: string;

  @Rule(RuleType.number())
  views: number;

  @Rule(RuleType.boolean())
  isPublished: boolean;

}
