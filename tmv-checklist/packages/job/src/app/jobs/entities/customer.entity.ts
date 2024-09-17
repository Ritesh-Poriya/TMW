import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type CustomerDocument = Customer & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Customer {
  _id: string;

  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String })
  serviceAddress: string;

  @Prop({ type: String, default: '' })
  billingAddress: string;

  @Prop({ required: true, type: String })
  phoneNumber: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
