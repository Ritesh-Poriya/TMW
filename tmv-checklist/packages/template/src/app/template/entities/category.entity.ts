import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Industry } from './industry.entity';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @ManyToOne(() => Industry, {
    eager: true,
  })
  industry: Industry;

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  @ManyToOne(() => Category, (category) => category.children, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  parent: Promise<Category>;

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  @OneToMany(() => Category, (category) => category.parent, {
    cascade: true,
    lazy: true,
  })
  children: Promise<Category[]>;

  @Column({
    default: false,
  })
  isPublic: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  companyId: string;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  createdBy: User;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  updatedBy: User;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  deletedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
