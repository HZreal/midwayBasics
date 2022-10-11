/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: string;
}

export interface IGetUserResponse {
  success: boolean;
  message: string;
  data: IUserOptions;
}

export interface User {
  id: number;
  name: string;
  age: number;
}

export interface User2 {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

