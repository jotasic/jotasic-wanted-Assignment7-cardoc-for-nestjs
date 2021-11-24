import { EntityRepository, Repository } from 'typeorm';
import { Tire } from './cars.entity';

@EntityRepository(Tire)
export class TireRepository extends Repository<Tire> {}
