import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '@user/dto/auth-credential.dto';
import { User, UserTire } from '@user/user.entity';
import { ExtendedRepository } from '@root/common/classes/advanced-repository.class';

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
      throw new BadRequestException('Existing id');
    }
    return user;
  }
}

@EntityRepository(UserTire)
export class UserTireRepository extends ExtendedRepository<UserTire> {}
