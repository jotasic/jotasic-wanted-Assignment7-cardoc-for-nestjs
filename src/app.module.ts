import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CarModule } from './car/car.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from 'src/configs/orm/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UserModule, CarModule],
})
export class AppModule {}
