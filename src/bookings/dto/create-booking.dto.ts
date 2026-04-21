import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNumber, IsString, Matches } from 'class-validator';
import { ServiceType } from '../models/booking.model';

export class CreateBookingDto {
  @ApiProperty({ example: 'user-1' })
  @IsString()
  user_id: string;

  @ApiProperty({ enum: ServiceType, example: ServiceType.CONSULTATION })
  @IsEnum(ServiceType, {
    message: 'service_type must be one of: consultation, demo, support',
  })
  service_type: ServiceType;

  @ApiProperty({ example: '2026-04-22', description: 'YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be a valid YYYY-MM-DD string (example: 2026-04-22)',
  })
  date: string;

  @ApiProperty({ example: '10:00', description: 'HH:MM' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'time_slot must be in HH:MM format' })
  time_slot: string;

  @ApiProperty({ enum: [30, 60], example: 30 })
  @IsNumber()
  @IsIn([30, 60], { message: 'duration_minutes must be 30 or 60' })
  duration_minutes: number; // Duration in minutes
}
