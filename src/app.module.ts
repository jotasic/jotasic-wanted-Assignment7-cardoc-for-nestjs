import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { CarModule } from '@car/car.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '@root/config/configuration';
import { DatabaseModule } from '@root/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    CarModule,
  ],
})
export class AppModule {}
