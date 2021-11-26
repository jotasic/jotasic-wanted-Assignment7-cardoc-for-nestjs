import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User, UserTire } from './user.entity';
import { ExtendedRepository } from 'src/common/classes/advanced-repository.class';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDot: AuthCredentialsDto): Promise<User> {
    const { id, password } = authCredentialsDot;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ id, password: hashedPassword });

    try {
      await user.save();
    } catch (error) {
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
export class UserTireRepository extends ExtendedRepository<UserTire> {}
