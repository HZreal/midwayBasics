import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { IUserOptions, User } from '../interface';
import { typegooseUser } from '../modelEntity/user';


@Provide()
export class UserService {
  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}

@Provide()
export class UserService2 {
  async getUser(id: number): Promise<User> {
    console.log('enter service ');

    return {
      id,
      name: 'Harry',
      age: 18,
    };
  }
}


@Provide()
export class TestTypegooseUserService {
  @InjectEntityModel(typegooseUser)
  userModel: ReturnModelType<typeof typegooseUser>;

  async getTest() {
    // create data
    const { _id: id } = await this.userModel.create({name: 'JohnDoe', jobs: ['Cleaner'] } as typegooseUser); // an "as" assertion, to have types for all properties

    // find data
    const user = await this.userModel.findById(id).exec();
    console.log(user);
  }


  async createUser() {
    const res = await this.userModel.create({name: 'JohnDoe', jobs: ['Cleaner'] } as typegooseUser); // an "as" assertion, to have types for all properties
    return res._id
  }

  async findUser(id) {
    const user = await this.userModel.findById(id).exec();
    console.log(user);
    return user
  }


}



