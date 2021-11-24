import { EntityRepository, Repository } from 'typeorm';
import { User, UserTire } from './users.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}

@EntityRepository(UserTire)
export class UserTireRepository extends Repository<UserTire> {}
