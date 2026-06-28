import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class WeatherAlert extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  alertType: string; // e.g., 'rain', 'storm', 'cold', 'heat'

  @Prop({ required: true })
  temperature: number;

  @Prop()
  description: string;

  @Prop()
  severity: string; // 'low', 'medium', 'high'

  @Prop({ default: false })
  sent: boolean;

  @Prop()
  sentAt?: Date;

  @Prop()
  telegramMessageId?: string;

  @Prop({ default: true })
  active: boolean;
}

export const WeatherAlertSchema = SchemaFactory.createForClass(WeatherAlert);
WeatherAlertSchema.index({ userId: 1 });
WeatherAlertSchema.index({ city: 1 });
WeatherAlertSchema.index({ sent: 1 });
