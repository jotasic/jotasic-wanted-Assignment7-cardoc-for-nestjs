import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { CarModule } from '@car/car.module';
import { DatabaseModule } from '@root/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CarModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
