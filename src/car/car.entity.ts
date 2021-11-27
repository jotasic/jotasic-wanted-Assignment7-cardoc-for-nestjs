import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTire } from '@user/user.entity';

@Entity('tires')
export class Tire extends BaseEntity {
  @PrimaryGeneratedColumn()
  pk: number;

  @Column()
  width: number;

  @Column()
  aspectRatio: number;

  @Column()
  wheelSize: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany((type) => UserTire, (userTire) => userTire.tire, { eager: false })
  userTires: UserTire[];
}
