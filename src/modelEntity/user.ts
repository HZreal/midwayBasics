import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { prop } from '@typegoose/typegoose';
import { EntityModel as typegooseEntityModel } from '@midwayjs/typegoose';

@EntityModel('tb_stu', { connectionName: 'pg' }) // 如果表名和当前的实体名不同，可以在参数中指定
export class PostgreTestUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;
}


// @midwayjs/typegoose中的EntityModel进行重命名
@typegooseEntityModel()
export class typegooseUser {
  @prop()
  public name?: string;

  @prop({ type: () => [String] })
  public jobs?: string[];
}
