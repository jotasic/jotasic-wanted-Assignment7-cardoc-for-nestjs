import { Tire } from 'src/car/car.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  pk: number;

  @Column()
  id: string;

  @Column()
  password: string;

  @OneToMany((type) => UserTire, (userTire) => userTire.user, { eager: false })
  userTires: UserTire[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}

@Entity('user_tires')
export class UserTire extends BaseEntity {
  @PrimaryGeneratedColumn()
  pk: number;

  @ManyToOne((type) => User, (user) => user.userTires, { eager: false })
  user: User;

  @ManyToOne((type) => Tire, (tire) => tire.userTires, { eager: false })
  tire: Tire;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
