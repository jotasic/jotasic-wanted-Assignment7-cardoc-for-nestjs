import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository, UserTireRepository } from './users.repository';
import { TireRepository } from '../cars/cars.repository';
import { User } from './users.entity';
import { AuthCredentialsDot } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TireRepository)
    private tireRepository: TireRepository,
    @InjectRepository(UserTireRepository)
    private userTireRepository: UserTireRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDot: AuthCredentialsDot,
  ): Promise<{ token: string }> {
    const user = await this.userRepository.createUser(authCredentialsDot);
    return await this.genAccessToken(user);
  }

  async signIn(
    authCredentialsDot: AuthCredentialsDot,
  ): Promise<{ token: string }> {
    const { id, password } = authCredentialsDot;

    const user = await this.userRepository.findOne({ id });

    if (user && (await bcrypt.compare(password, user.password))) {
      return await this.genAccessToken(user);
    } else {
      throw new BadRequestException('signIn failed');
    }
  }

  async genAccessToken(user: User): Promise<{ token: string }> {
    return { token: this.jwtService.sign({ id: user.id }) };
  }
}
