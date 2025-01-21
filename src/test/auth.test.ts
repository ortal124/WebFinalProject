import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import userService from '../services/user_service';
import initApp from '../server';
import { IUser } from '../interfaces/IUser';

let app: Express;

type User = IUser & {
  accessToken?: string;
  refreshToken?: string;
};

let testUser: User = {
  email: 'testAuth@user.com',
  password: 'testpassword',
  username: 'testuserauth',
};

describe('Auth Routes', () => {
  let userId = '';
  let usersToDelete: string[] = [];

  beforeAll(async () => {
    console.log('beforeAll');
    app = await initApp();
    const user = await userService.createUser({ username: testUser.username, password: testUser.password, email: testUser.email });
    userId = user.id;
    usersToDelete.push(userId);
  });

  afterAll(async () => {
    console.log('afterAll');
    if (usersToDelete.length) {
      for (const id of usersToDelete) {
          console.log('deleting user:', id);
          await userService.deleteUser(id);
      }
    }
    mongoose.connection.close();
  });

  describe('POST /auth/login', () => {
    it('should login a user successfully', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: testUser.username, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      testUser.accessToken = response.body.accessToken;
      testUser.refreshToken = response.body.refreshToken;
      testUser._id = response.body._id;
    });

    it('should return 400 for invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: testUser.refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      testUser.accessToken = response.body.accessToken;
      testUser.refreshToken = response.body.refreshToken;
    });

    it('should return 400 for invalid request', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalidRefreshToken' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout a user successfully', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .send({ refreshToken: testUser.refreshToken });

      expect(response.status).toBe(200);
    });

    it('should return 400 for invalid request', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .send({ refreshToken: 'invalidRefreshToken' });

      expect(response.status).toBe(400);
    });
  });

  
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'newUser',
                email: 'newUser@user.com',
                password: 'newpassword',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        usersToDelete.push(response.body._id);
    });

    it('should return 400 for invalid request', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: '',
                email: 'invalidEmail',
                password: '',
            });

        expect(response.status).toBe(400);
    });
  });
});