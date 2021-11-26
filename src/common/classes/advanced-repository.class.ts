import { Repository } from 'typeorm';

export class ExtendedRepository<Entity> extends Repository<Entity> {
  async getOrCreate(dto: any): Promise<Entity> {
    const instance = await this.findOne(dto);
    if (instance) return instance;

    return this.save(dto);
  }
}
