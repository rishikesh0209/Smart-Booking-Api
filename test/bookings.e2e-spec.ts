import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('POST /bookings (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('1) returns 201 for successful booking', async () => {
    const payload = {
      user_id: 'user-1',
      service_type: 'consultation',
      date: '2099-12-01',
      time_slot: '10:00',
      duration_minutes: 60,
    };

    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send(payload)
      .expect(201);

    expect(response.body).toMatchObject({
      status: 'confirmed',
      user_id: 'user-1',
      service_type: 'consultation',
      date: '2099-12-01',
      time_slot: '10:00',
      duration_minutes: 60,
    });
    expect(response.body.booking_id).toBeDefined();
  });

  it('2) returns 409 when slot is already booked', async () => {
    const firstPayload = {
      user_id: 'user-1',
      service_type: 'consultation',
      date: '2099-12-02',
      time_slot: '10:00',
      duration_minutes: 60,
    };

    const secondPayload = {
      user_id: 'user-2',
      service_type: 'demo',
      date: '2099-12-02',
      time_slot: '10:30',
      duration_minutes: 30,
    };

    await request(app.getHttpServer()).post('/bookings').send(firstPayload).expect(201);
    await request(app.getHttpServer())
      .post('/bookings')
      .send(secondPayload)
      .expect(409);
  });

  it('3) returns 400 when required fields are missing', async () => {
    const payloadMissingUser = {
      service_type: 'consultation',
      date: '2099-12-03',
      time_slot: '11:00',
      duration_minutes: 30,
    };

    await request(app.getHttpServer())
      .post('/bookings')
      .send(payloadMissingUser)
      .expect(400);
  });

  it('4) returns 400 for invalid service type', async () => {
    const payload = {
      user_id: 'user-1',
      service_type: 'tennis',
      date: '2099-12-04',
      time_slot: '12:00',
      duration_minutes: 30,
    };

    await request(app.getHttpServer()).post('/bookings').send(payload).expect(400);
  });

  it('5) returns 400 for invalid date format', async () => {
    const payload = {
      user_id: 'user-1',
      service_type: 'support',
      date: '12-31-2099',
      time_slot: '13:00',
      duration_minutes: 30,
    };

    await request(app.getHttpServer()).post('/bookings').send(payload).expect(400);
  });
});
