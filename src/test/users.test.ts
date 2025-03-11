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
    email: 'testUser@user.com',
    password: 'testpassword',
    username: 'testuser',
};

describe('User Routes', () => {
    let userId = '';

    beforeAll(async () => {
        app = await initApp();
        const user = await userService.createUser({ username: testUser.username, password: testUser.password, email: testUser.email });
        userId = user.id;

        const loginResponse = await request(app)
        .post('/auth/login')
        .send({ username: testUser.username, password: testUser.password });

        testUser.accessToken = loginResponse.body.accessToken;
        testUser.refreshToken = loginResponse.body.refreshToken;
    });

    afterAll(async () => {
        if (userId) {
            await userService.deleteUser(userId);
        }
        mongoose.connection.close();
    });

    describe('GET /profile/:id', () => {
        it('should get user profile successfully', async () => {
            const response = await request(app)
                .get(`/users/profile/${userId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('username', testUser.username);
        });

        it('should return 404 for non-existing user', async () => {
            const nonExistentUserId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .get(`/users/profile/${nonExistentUserId}`)

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /:id/photo', () => {
        it('should upload user photo successfully', async () => {
            const response = await request(app)
                .put(`/users/${userId}/photo`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .attach('photo', './src/test/tests_pic.jpg');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('profileImage');
        });

        it('should return 400 for no photo uploaded', async () => {
            const response = await request(app)
                .put(`/users/${userId}/photo`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)

            expect(response.status).toBe(400);
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .put(`/users/${userId}/photo`)
                .set('Authorization', 'bearer invalidToken');

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /userName', () => {
        it('should update username successfully', async () => {
            const newUsername = 'updatedUser';
            const response = await request(app)
                .put('/users/userName')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ username: newUsername });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('username', newUsername);
        });

        it('should return 400 for invalid username update', async () => {
            const response = await request(app)
                .put('/users/userName')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ username: '' });

            expect(response.status).toBe(400);
        });
        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .put('/users/userName')
                .set('Authorization', `Bearer invalidToken`)
                .send({ username: '' });

            expect(response.status).toBe(401);
        });
    });
});