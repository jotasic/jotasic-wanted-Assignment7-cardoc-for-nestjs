import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository, UserTireRepository } from './users.repository';
import { TireRepository } from '../cars/cars.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TireRepository)
    private tireRepository: TireRepository,
    @InjectRepository(TireRepository)
    private userTireRepository: UserTireRepository,
  ) {}
}
