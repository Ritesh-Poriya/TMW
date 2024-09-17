import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { LinkedSubCategory } from './linkedSubCategory.entity';
import { Template } from './template.entity';

@Entity()
export class LinkedCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  refId: string;

  @Column()
  name: string;

  @Column()
  order: number;

  @ManyToOne(() => Template, (template) => template.linkedCategories, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  template: Template;

  @OneToMany(() => Task, (task) => task.linkedCategory)
  tasks: Task[];

  @OneToMany(
    () => LinkedSubCategory,
    (linkedSubCategory) => linkedSubCategory.linkedCategory,
  )
  linkedSubCategories: LinkedSubCategory[];
}
