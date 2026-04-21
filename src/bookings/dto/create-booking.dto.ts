import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';
import { ServiceType } from '../models/booking.model';

export class CreateBookingDto {
  @ApiProperty({ example: 'user-1' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '2026-04-22T10:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2026-04-22T11:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ enum: ServiceType, example: ServiceType.TENNIS })
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
