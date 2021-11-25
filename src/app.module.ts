import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from 'src/configs/typeorm.config';
import { UserRepository, UserTireRepository } from './users/users.repository';
import { TireRepository } from './cars/cars.repository';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UsersModule, CarsModule],
})
export class AppModule {}
