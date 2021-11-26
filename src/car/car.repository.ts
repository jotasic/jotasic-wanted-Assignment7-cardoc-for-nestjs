import { ExtendedRepository } from 'src/common/classes/advanced-repository.class';
import { EntityRepository } from 'typeorm';
import { Tire } from './car.entity';

@EntityRepository(Tire)
export class TireRepository extends ExtendedRepository<Tire> {}
