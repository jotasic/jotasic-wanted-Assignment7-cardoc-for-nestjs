import * as faker from 'faker';
import * as bcrypt from 'bcryptjs';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TireRepository } from 'src/car/car.repository';
import { UserRepository, UserTireRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UsersService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

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
  });

  describe('1. User Test', () => {
    it('SignUp success ', async () => {
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

    it('SignIn success ', async () => {
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

    it('SignIn failed - invalid id ', async () => {
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

    it('SignIn failed - invalid password', async () => {
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
});
