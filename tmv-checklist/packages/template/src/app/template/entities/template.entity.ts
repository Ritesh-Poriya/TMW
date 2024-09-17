import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Industry } from './industry.entity';
import { LinkedCategory } from './linkedCategory.entity';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Industry, { eager: true, onDelete: 'CASCADE' })
  industry: Industry;

  @OneToMany(
    () => LinkedCategory,
    (linkedCategory) => linkedCategory.template,
    {
      cascade: true,
    },
  )
  linkedCategories: LinkedCategory[];

  @Column({
    default: false,
  })
  isPublic: boolean;

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

  @Column({ nullable: true, default: null })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
