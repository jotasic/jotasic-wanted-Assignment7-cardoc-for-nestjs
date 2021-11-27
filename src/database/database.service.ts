import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      namingStrategy: new SnakeNamingStrategy(),
      type: this.configService.get<string>('db.type') as any,
      host: this.configService.get<string>('db.host'),
      port: this.configService.get<number>('db.port', 5432),
      username: this.configService.get<string>('db.username'),
      password: this.configService.get<string>('db.password'),
      database: this.configService.get<string>('db.database'),
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: this.configService.get<boolean>('db.synchronize'),
    };
  }
}
