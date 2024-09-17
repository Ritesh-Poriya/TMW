import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InputType } from '.';
import { LinkedCategory } from './linkedCategory.entity';
import { LinkedSubCategory } from './linkedSubCategory.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => LinkedCategory, {
    onDelete: 'CASCADE',
  })
  linkedCategory: LinkedCategory;

  @ManyToOne(() => LinkedSubCategory, {
    onDelete: 'CASCADE',
  })
  linkedSubCategory: LinkedSubCategory;

  @Column()
  order: number;

  @ManyToOne(() => InputType, { eager: true })
  inputType: InputType;

  @Column({ type: 'json' })
  inputTypeOptions: string;

  @Column({ type: 'bool' })
  enableCamera: boolean;

  @Column({ type: 'bool' })
  enableComments: boolean;

  @Column({ type: 'bool' })
  enableTrainingInfo: boolean;

  @Column({ type: 'json', nullable: true })
  trainingInfoOptions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
