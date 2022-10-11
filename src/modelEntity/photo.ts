import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('tb_photo', { connectionName: 'default' }) // 如果表名和当前的实体名不同，可以在参数中指定
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    name: 'name',
  })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('double')
  views: number;

  @Column()
  isPublished: boolean;
}
