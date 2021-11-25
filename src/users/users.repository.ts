import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDot } from './dto/auth-credential.dto';
import { User, UserTire } from './users.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDot: AuthCredentialsDot): Promise<User> {
    const { id, password } = authCredentialsDot;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ id, password: hashedPassword });

    try {
      await user.save();
    } catch (error) {
      console.log(`error`, error);
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }
}

@EntityRepository(UserTire)
export class UserTireRepository extends Repository<UserTire> {}
