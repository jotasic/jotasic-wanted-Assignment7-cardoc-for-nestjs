import axios from 'axios';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository, UserTireRepository } from '@user/user.repository';
import { TireRepository } from '@car/car.repository';
import { User } from '@user/user.entity';
import { AuthCredentialsDto } from '@user/dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { TrimRegistrationDto } from '@user/dto/trim-registration.dto';
import { TireRegistrationDto } from '@car/dto/tire-registration.dto';
import { Tire } from '@car/car.entity';

const TRIM_API_URL = 'https://dev.mycar.cardoc.co.kr/v1/trim';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TireRepository)
    private tireRepository: TireRepository,
    @InjectRepository(UserTireRepository)
    private userTireRepository: UserTireRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDot: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    const user = await this.userRepository.createUser(authCredentialsDot);
    return await this.genAccessToken(user);
  }

  async signIn(
    authCredentialsDot: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    const { id, password } = authCredentialsDot;

    const user = await this.userRepository.findOne({ id });

    if (user && (await bcrypt.compare(password, user.password))) {
      return await this.genAccessToken(user);
    } else {
      throw new BadRequestException('signIn failed');
    }
  }

  private async genAccessToken(user: User): Promise<{ token: string }> {
    return { token: this.jwtService.sign({ id: user.id }) };
  }

  async registerTires(trimRegistrationDto: TrimRegistrationDto[]) {
    // 등록하기 편하게 아래와 같이 trimID기준으로 data를 조작한다. 타이어 정보도 획득한다.
    // [{trimID : {id:[ids..], tires:[dto...]}}]
    const organizedData = trimRegistrationDto.reduce((pre, cur) => {
      if (pre[cur.trimId]) {
        pre[cur.trimId].id.add(cur.id);
      } else {
        pre[cur.trimId] = {
          id: new Set([cur.id]),
          tires: this.getTireInfo(cur.trimId),
        };
      }
      return pre;
    }, {});

    // DB에 등록한다.
    for (const value of Object.values(organizedData)) {
      const users = value['id'];
      const tires = await value['tires'];

      for (const user of users) {
        const userInstance = await this.userRepository.findOne({
          id: user,
        });
        if (!userInstance) {
          throw new BadRequestException('the id dose not exist');
        }
        for (const tire of tires) {
          const tireInstance = await this.tireRepository.getOrCreate(tire);
          await this.userTireRepository.getOrCreate({
            user: userInstance,
            tire: tireInstance,
          });
        }
      }
    }
  }

  private parserTireInfo(tireInfo): TireRegistrationDto {
    tireInfo = tireInfo?.replaceAll(' ', '').toUpperCase();
    const regex = '[0-9]*/[0-9]*[R][0-9]*$';
    const matched = tireInfo?.match(regex);

    if (!matched) {
      return null;
    }
    tireInfo = tireInfo.substring(matched.index, tireInfo.length);
    tireInfo = tireInfo.replace('/', '-').replace('R', '-').split('-');
    const tireRegistrationDto: TireRegistrationDto = {
      width: parseInt(tireInfo[0]),
      aspectRatio: parseInt(tireInfo[1]),
      wheelSize: parseInt(tireInfo[2]),
    };

    return tireRegistrationDto;
  }

  async getUsersTires(id: string): Promise<Tire[]> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new BadRequestException('Dose not exist user');
    }

    return await this.tireRepository
      .createQueryBuilder('tire')
      .innerJoin('tire.userTires', 'userTire')
      .select(['tire.width', 'tire.aspectRatio', 'tire.wheelSize'])
      .where('userTire.user =:user', { user: user.pk })
      .getMany();
  }

  private async getTireInfo(trimId: number): Promise<string[]> {
    const result = await axios.get(`${TRIM_API_URL}/${trimId}`, {
      timeout: 1000,
    });

    const tires = Array.from(
      new Set([
        result?.data?.spec?.driving?.frontTire?.value,
        result?.data?.spec?.driving?.rearTire?.value,
      ]),
    );

    return tires.reduce((pre, cur) => {
      const tire = this.parserTireInfo(cur);
      if (tire) pre.push(tire);
      return pre;
    }, []);
  }
}
