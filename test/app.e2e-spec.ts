import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@root/app.module';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@root/database/database.service';
import axios from 'axios';

class MockTypeOrmConfigServer implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      dropSchema: true,
      entities: ['src/**/*.entity{.ts,.js}'],
    };
  }
}

const mockTypeOrmConfigService = new MockTypeOrmConfigServer();

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeOrmConfigService)
      .useValue(mockTypeOrmConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('SignUp', () => {
    it('Should be return 200', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .send({ id: 'taewoo', password: '12345678' })
        .expect(200);
    });
    it('Should be throw BadRequestException - duplicate id', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .send({ id: 'taewoo', password: '12345678' })
        .expect(400);
    });

    it('Should be throw BadRequestException - data error', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .send({ id: 'taewoo' })
        .expect(400);
    });
  });
  describe('SignIn', () => {
    it('Should be return 200', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({ id: 'taewoo', password: '12345678' })
        .expect(200);
    });
    it('Should be throw BadRequestException - dose not exist id', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({ id: 'newuser', password: '12345678' })
        .expect(400);
    });

    it('Should be throw BadRequestException - invalid password', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({ id: 'taewoo', password: '1234' })
        .expect(400);
    });

    it('Should be throw BadRequestException - data error', () => {
      return request(app.getHttpServer())
        .post('/users/signin')
        .send({ id: 'taewoo' })
        .expect(400);
    });
  });

  describe('Register Tires', () => {
    it('Should be return 200', async () => {
      const user = await request(app.getHttpServer())
        .post('/users/signin')
        .send({ id: 'taewoo', password: '12345678' });

      const spyGet = jest.spyOn(axios, 'get');
      spyGet.mockResolvedValue({
        data: {
          spec: {
            driving: {
              frontTire: { value: '205/75R18' },
              rearTire: { value: 'P260/60R15' },
            },
          },
        },
      });

      return request(app.getHttpServer())
        .post('/users/register-tires')
        .send([{ id: 'taewoo', trimId: 1000 }])
        .set('Authorization', `Bearer ${user.body.token}`)
        .expect(200);
    });

    it('Should be throw BadRequestException - invalid id', async () => {
      const user = await request(app.getHttpServer())
        .post('/users/signin')
        .send({ id: 'taewoo', password: '12345678' });

      return request(app.getHttpServer())
        .post('/users/register-tires')
        .send([{ id: 'nouser', trimId: 1000 }])
        .set('Authorization', `Bearer ${user.body.token}`)
        .expect(400);
    });

    it('Should be throw BadRequestException - more than 5', async () => {
      const user = await request(app.getHttpServer())
        .post('/users/signin')
        .send({ id: 'taewoo', password: '12345678' });

      return request(app.getHttpServer())
        .post('/users/register-tires')
        .send([
          { id: 'taewoo', trimId: 1000 },
          { id: 'taewoo', trimId: 2000 },
          { id: 'taewoo', trimId: 3000 },
          { id: 'taewoo', trimId: 4000 },
          { id: 'taewoo', trimId: 5000 },
          { id: 'taewoo', trimId: 6000 },
        ])
        .set('Authorization', `Bearer ${user.body.token}`)
        .expect(400);
    });

    it('Should be throw BadRequestException - no authorization', async () => {
      return request(app.getHttpServer())
        .post('/users/register-tires')
        .expect(401);
    });
  });

  describe('Get Users tires', () => {
    it('Should be return 200', async () => {
      const user = await request(app.getHttpServer())
        .post('/users/signin')
        .send({ id: 'taewoo', password: '12345678' });

      const tire = await request(app.getHttpServer())
        .get('/users/taewoo/tires')
        .set('Authorization', `Bearer ${user.body.token}`)
        .expect(200);

      return expect(tire.body).toEqual([
        { width: 205, aspectRatio: 75, wheelSize: 18 },
        { width: 260, aspectRatio: 60, wheelSize: 15 },
      ]);
    });

    it('Should be throw BadRequestException - invalid user', async () => {
      const user = await request(app.getHttpServer())
        .post('/users/signin')
        .send({ id: 'taewoo', password: '12345678' });

      return request(app.getHttpServer())
        .get('/users/nouser/tires')
        .set('Authorization', `Bearer ${user.body.token}`)
        .expect(400);
    });

    it('Should be throw BadRequestException - no authorization', async () => {
      return request(app.getHttpServer())
        .get('/users/taewoo/tires')
        .expect(401);
    });
  });
});
