import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('POST /bookings', () => {
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
    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        user_id: 'user-1',
        service_type: 'consultation',
        date: '2099-12-01',
        time_slot: '10:00',
        duration_minutes: 60,
      })
      .expect(201);
  });

  it('2) returns 409 when slot is already booked', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        user_id: 'user-1',
        service_type: 'consultation',
        date: '2099-12-02',
        time_slot: '10:00',
        duration_minutes: 60,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        user_id: 'user-2',
        service_type: 'demo',
        date: '2099-12-02',
        time_slot: '10:30',
        duration_minutes: 30,
      })
      .expect(409);
  });

  it('3) returns 400 when required fields are missing', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        service_type: 'consultation',
        date: '2099-12-03',
        time_slot: '11:00',
        duration_minutes: 30,
      })
      .expect(400);
  });

  it('4) returns 400 for invalid service type', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        user_id: 'user-1',
        service_type: 'invalid-service',
        date: '2099-12-04',
        time_slot: '12:00',
        duration_minutes: 30,
      })
      .expect(400);
  });

  it('5) returns 400 for invalid or past date', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        user_id: 'user-1',
        service_type: 'support',
        date: '12-31-2099',
        time_slot: '13:00',
        duration_minutes: 30,
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        user_id: 'user-1',
        service_type: 'support',
        date: '2020-01-01',
        time_slot: '13:00',
        duration_minutes: 30,
      })
      .expect(400);
  });
});
