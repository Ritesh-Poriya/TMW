import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { LinkedCategory } from './linkedCategory.entity';

@Entity()
export class LinkedSubCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  refId: string;

  @ManyToOne(
    () => LinkedCategory,
    (linkedCategory) => linkedCategory.linkedSubCategories,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  linkedCategory: LinkedCategory;

  @OneToMany(() => Task, (task) => task.linkedSubCategory)
  tasks: Task[];

  @Column()
  order: number;
}
