import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillingContact } from './billing-contact.entity';
import { CompanyTenant } from './company-tenant.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => BillingContact, (billingContact) => billingContact.company, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  billingContact: BillingContact;

  @OneToOne(() => CompanyTenant, (companyTenant) => companyTenant.company, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  companyTenant: CompanyTenant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
