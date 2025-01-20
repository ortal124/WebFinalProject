import UserModel from '../models/user_model';
import { IUser } from '../interfaces/IUser';
import bcrypt from 'bcrypt';

class UserService {

  async createUser(userData: IUser) {
    const password = userData.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    userData.password = hashedPassword;
    const user = new UserModel( userData );
    return user.save();
  }

  async getUser(userId: string) {
    return UserModel.findById(userId);
  }

  async findDUserByField(field: string, value: any) {
      try {
          const query = { [field]: value };
          const user = await UserModel.findOne(query);
          return user;
      } catch (error) {
          console.error(`Error finding user by field "${field}":`, error);
          throw new Error('Failed to search for the document');
      }
  };
}

export default new UserService();