import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class CompanyTenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tenantName: string;

  @Column()
  renewalDate: Date;

  @Column()
  maxUsers: number;

  @Column({ default: true })
  active: boolean;

  @Column()
  tenantMasterAdminEmail: string;

  @OneToOne(() => Company, (company) => company.companyTenant, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
