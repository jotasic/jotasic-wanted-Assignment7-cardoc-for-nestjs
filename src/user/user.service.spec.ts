import * as faker from 'faker';
import * as bcrypt from 'bcryptjs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TireRepository } from 'src/car/car.repository';
import { UserRepository, UserTireRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User, UserTire } from './user.entity';
import { UserService } from './user.service';
import { TrimRegistrationDto } from './dto/trim-registration.dto';
import { Tire } from 'src/car/car.entity';
import axios from 'axios';
import { TireRegistrationDto } from 'src/car/dto/tire-registration.dto';
import { SelectQueryBuilder } from 'typeorm';

describe('UsersService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let tireRepository: TireRepository;
  let userTireRepository: UserTireRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        UserService,
        UserRepository,
        TireRepository,
        UserTireRepository,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    tireRepository = module.get<TireRepository>(TireRepository);
    userTireRepository = module.get<UserTireRepository>(UserTireRepository);
  });

  describe('SignUp', () => {
    it('Should be return access token. ', async () => {
      const id = faker.lorem.sentence();
      const password = faker.lorem.sentence();
      const authCredentialsDot: AuthCredentialsDto = { id, password };
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const token = {
        token: jwtService.sign({ id }),
      };
      const user = new User();
      user.id = id;
      user.password = hashedPassword;

      const userRepositoryCreateUserSpy = jest
        .spyOn(userRepository, 'createUser')
        .mockResolvedValue(user);

      const result = await userService.signUp(authCredentialsDot);
      expect(userRepositoryCreateUserSpy).toBeCalledWith(authCredentialsDot);
      expect(result).toEqual(token);
    });
  });
  describe('SignIn', () => {
    it('Should be return access token.', async () => {
      const id = faker.lorem.sentence();
      const password = faker.lorem.sentence();
      const authCredentialsDot: AuthCredentialsDto = { id, password };

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User();
      user.pk = 1;
      user.id = id;
      user.password = hashedPassword;

      const token = {
        token: jwtService.sign({ id: user.id }),
      };

      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(user);

      const result = await userService.signIn(authCredentialsDot);
      expect(userRepositoryFindOneSpy).toBeCalledWith({ id });
      expect(result).toEqual(token);
    });

    it('Should be throw BadRequestException.(invalid id) ', async () => {
      const id = faker.lorem.sentence();
      const password = faker.lorem.sentence();
      const authCredentialsDot: AuthCredentialsDto = { id, password };

      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await userService.signIn(authCredentialsDot);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
      expect(userRepositoryFindOneSpy).toBeCalledWith({ id });
    });

    it('Should be throw BadRequestException.(invalid password)', async () => {
      const id = faker.lorem.sentence();
      const password = faker.lorem.sentence();
      const invalidPassword = faker.lorem.sentence();
      const authCredentialsDot: AuthCredentialsDto = {
        id,
        password: invalidPassword,
      };

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User();
      user.id = id;
      user.password = hashedPassword;

      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(user);

      try {
        await userService.signIn(authCredentialsDot);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
      expect(userRepositoryFindOneSpy).toBeCalledWith({ id });
    });
  });

  describe('registerTires', () => {
    it('Should not be throw BadRequestException.', async () => {
      const trimRegistrationDto1: TrimRegistrationDto = {
        id: 'taewoo',
        trimId: 1000,
      };

      const trimRegistrationDto2: TrimRegistrationDto = {
        id: 'taewoo',
        trimId: 2000,
      };

      const user = new User();
      user.pk = 1;
      user.id = trimRegistrationDto1.id;
      user.password = '1234';

      const tire1 = new Tire();
      tire1.pk = 1;
      tire1.width = 255;
      tire1.aspectRatio = 60;
      tire1.wheelSize = 16;

      const tire2 = new Tire();
      tire2.pk = 2;
      tire2.width = 260;
      tire2.aspectRatio = 55;
      tire2.wheelSize = 15;

      const tireRegistrationDto1: TireRegistrationDto = {
        width: tire1.width,
        aspectRatio: tire1.aspectRatio,
        wheelSize: tire1.wheelSize,
      };

      const tireRegistrationDto2: TireRegistrationDto = {
        width: tire2.width,
        aspectRatio: tire2.aspectRatio,
        wheelSize: tire2.wheelSize,
      };

      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(user);

      const tireRepositoryGetOrCreateSpy = jest
        .spyOn(tireRepository, 'getOrCreate')
        .mockResolvedValue(tire1)
        .mockResolvedValueOnce(tire1)
        .mockResolvedValueOnce(tire2);

      const userTireRepositoryGetOrCreateSpy = jest
        .spyOn(userTireRepository, 'getOrCreate')
        .mockResolvedValue(new UserTire());

      const trim1MockData = {
        data: {
          spec: {
            driving: {
              frontTire: {
                value: '255/60R16',
              },
              rearTire: {
                value: '255/60R16',
              },
            },
          },
        },
      };

      const trim2MockData = {
        data: {
          spec: {
            driving: {
              frontTire: {
                value: '260/55R15',
              },

              rearTire: {
                value: '260/55R15',
              },
            },
          },
        },
      };

      jest
        .spyOn(axios, 'get')
        .mockResolvedValue(trim1MockData)
        .mockResolvedValueOnce(trim1MockData)
        .mockResolvedValueOnce(trim2MockData);

      await userService.registerTires([
        trimRegistrationDto1,
        trimRegistrationDto2,
      ]);

      expect(userRepositoryFindOneSpy).toBeCalledWith({
        id: trimRegistrationDto1.id,
      });

      expect(tireRepositoryGetOrCreateSpy).toHaveBeenNthCalledWith(
        1,
        tireRegistrationDto1,
      );
      expect(tireRepositoryGetOrCreateSpy).toHaveBeenNthCalledWith(
        2,
        tireRegistrationDto2,
      );
      expect(userTireRepositoryGetOrCreateSpy).toHaveBeenNthCalledWith(1, {
        user: user,
        tire: tire1,
      });
      expect(userTireRepositoryGetOrCreateSpy).toHaveBeenNthCalledWith(2, {
        user: user,
        tire: tire2,
      });
    });
  });

  describe('getUsersTires', () => {
    it('Should be throw BadRequestException', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        await userService.getUsersTires('taewoo');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }

      expect(userRepositoryFindOneSpy).toBeCalledWith({ id: 'taewoo' });
    });
  });
});
