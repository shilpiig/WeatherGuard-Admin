import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ enum: ['google', 'github'], required: true })
  provider: string;

  @Prop({ required: true, unique: true })
  providerId: string;

  @Prop({ enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop()
  profilePicture?: string;

  @Prop()
  telegramChatId?: string;

  @Prop()
  telegramUsername?: string;

  @Prop()
  requestMessage?: string;

  @Prop()
  approvedAt?: Date;

  @Prop()
  approvedBy?: string; // Admin ID who approved

  @Prop()
  rejectedAt?: Date;

  @Prop()
  rejectedBy?: string; // Admin ID who rejected

  @Prop({ default: true })
  receiveAlerts: boolean;

  @Prop({ type: Object, default: {} })
  preferences: {
    cities?: string[];
    alertTypes?: string[];
    language?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
UserSchema.index({ providerId: 1 });
UserSchema.index({ status: 1 });
