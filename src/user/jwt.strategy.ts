import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    const { id } = payload;
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
