import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { JobStatus } from '../@types';
import { Customer } from './customer.entity';

export type JobDocument = Job & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Job {
  _id: string;

  @Prop({ required: true })
  templateId: string;

  @Prop({ required: true })
  templateName: string;

  @Prop()
  date: Date;

  @Prop()
  jobNumber: number;

  @Prop({
    type: String,
    enum: Object.values(JobStatus),
    default: JobStatus.INCOMPLETE,
  })
  status?: JobStatus;

  @Prop({ type: String, default: '' })
  techSummery: string;

  @Prop({ type: String, default: '' })
  technicianSinature: string;

  @Prop({ type: String, default: '' })
  customerSignature: string;

  @Prop({ type: String, default: '' })
  agreedUponNextStep: string;

  @Prop({ type: Boolean, default: false })
  isSelfAgreed: boolean;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  })
  customerId: Customer;

  @Prop({ required: true, type: Object })
  jobTechnician: {
    firstName: string;
    lastName: string;
    id: string;
  };

  @Prop({ required: true, type: Object })
  checklistSchema: object;

  @Prop({ required: false, type: Object })
  checklistResponse: object;

  @Prop({ required: false, type: String })
  customerAcknowledgement: string;

  createdAt: Date;
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
