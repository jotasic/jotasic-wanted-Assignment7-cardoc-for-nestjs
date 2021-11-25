import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserRepository, UserTireRepository } from './users.repository';
import { TireRepository } from '../cars/cars.repository';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      TireRepository,
      UserTireRepository,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
