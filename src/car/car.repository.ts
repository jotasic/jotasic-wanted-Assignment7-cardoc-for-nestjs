import { ExtendedRepository } from '@root/common/classes/advanced-repository.class';
import { EntityRepository } from 'typeorm';
import { Tire } from '@car/car.entity';

@EntityRepository(Tire)
export class TireRepository extends ExtendedRepository<Tire> {}
