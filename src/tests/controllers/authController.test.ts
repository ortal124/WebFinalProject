import request from 'supertest';
import app from '../../server';
import userModel from '../../models/user_model';
import { mockedUser } from '../mockData';

describe('Auth Controller', () => {

  // Test for user registration
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(mockedUser)
      .expect(200);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.email).toBe(mockedUser.email);
  });

  // Test for login
  it('should login the user and return tokens', async () => {
    await userModel.create(mockedUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: mockedUser.username,
        password: mockedUser.password
      })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  // Test for failed login
  it('should fail to login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'wrongUser',
        password: 'wrongPassword'
      })
      .expect(400);

    expect(res.text).toBe('Wrong username or password');
  });

  // Test for logout
  it('should logout and clear the refresh token', async () => {
    const user = await userModel.create(mockedUser);
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: user.refreshToken })
      .expect(200);

    expect(res.text).toBe('Success');
  });

});
