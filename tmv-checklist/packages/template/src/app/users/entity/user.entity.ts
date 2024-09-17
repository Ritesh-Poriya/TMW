import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountStatus } from '../@types';
import { UserRole } from '../@types/users';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  userId: string;

  @Column()
  email: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SUPER_ADMIN,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
