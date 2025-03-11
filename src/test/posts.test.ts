import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import initApp from '../server';
import { IUser } from '../interfaces/IUser';
import { IPost } from '../interfaces/IPost';
import userService from '../services/user_service';
import * as postService from '../services/post_service';

let app: Express;

type User = IUser & {
    accessToken?: string;
    refreshToken?: string;
};

let testUser: User = {
    username: 'testPostUser',
    email: 'testposts@user.com',
    password: 'testpassword',
};

let testPostText = "post text";

describe('Post Routes', () => {
    let userId = '';
    let postId = '';

    beforeAll(async () => {
        app = await initApp();
        const user = await userService.createUser({ username:testUser.username, email: testUser.email, password: testUser.password });
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
        if (postId) {
            await postService.deletePost(postId);
        }
        mongoose.connection.close();
    });

    describe('POST /post', () => {
        it('should create a new post', async () => {
            const response = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .field('text', testPostText)
                .attach('image','./src/test/tests_pic.jpg');

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            postId = response.body._id;
        });

        it('should return 400 for invalid request - no image', async () => {
            const response = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .field('text', testPostText)

            expect(response.status).toBe(400);
        });

        it('should return 400 for invalid request - no text', async () => {
            const response = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .attach('image','./src/test/tests_pic.jpg');

            expect(response.status).toBe(400);
        });
    });

    describe('GET /posts', () => {
        it('should get all posts', async () => {
            const response = await request(app)
                .get('/posts')

            expect(response.status).toBe(200);
            expect(response.body.downloadedPosts).toBeInstanceOf(Array);
        });
    });

    describe('GET /posts/:id', () => {
        it('should get a post by ID', async () => {
            const response = await request(app)
                .get(`/posts/${postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', postId);
        });

        it('should return 404 for non-existent post ID', async () => {
            const nonExistentPostId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .get(`/posts/${nonExistentPostId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);

        
            expect(response.status).toBe(404);
        });
    });

    describe('PUT /post/:id', () => {
        it('should update a post text by ID', async () => {
            const response = await request(app)
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .field('text', 'Updated post content');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('text', 'Updated post content');
        });

        it('should update a post image by ID', async () => {
            const response = await request(app)
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .attach('image','./src/test/tests_pic2.jpg');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('image');
        });

        it('should update a post by ID', async () => {
            const response = await request(app)
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .field('text', 'Updated post content22')
                .attach('image','./src/test/tests_pic.jpg');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('image');
        });

        it('should return 400 for invalid request', async () => {
            const response = await request(app)
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({});

            expect(response.status).toBe(400);
        });

        it('should return 404 for non-existent post ID', async () => {
            const nonExistentPostId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .put(`/posts/${nonExistentPostId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`)
                .send({ text: 'Updated post content' });

            expect(response.status).toBe(404);
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .put(`/posts/${postId}`)
                .set('Authorization', `invalidToken}`)

            expect(response.status).toBe(401);
        });
    });


    describe('POST /posts/:id/like', () => {
        it('should like a post', async () => {
            const response = await request(app)
                .post(`/posts/${postId}/like`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('likes');
            expect(Array.isArray(response.body.likes)).toBe(true);
            expect(response.body.likes).toContain(userId); 
        });
    
        it('should return 404 for non-existent post ID', async () => {
            const nonExistentPostId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .post(`/posts/${nonExistentPostId}/like`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);
    
            expect(response.status).toBe(404);
        });
    
        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .post(`/posts/${postId}/like`)
                .set('Authorization', `invalidToken`);
    
            expect(response.status).toBe(401);
        });
    });
    
    describe('DELETE /posts/:id/like', () => {
        it('should unlike a post', async () => {
            const response = await request(app)
                .delete(`/posts/${postId}/like`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('likes');
            expect(Array.isArray(response.body.likes)).toBe(true);
            expect(response.body.likes).not.toContain(userId); 
        });
    
        it('should return 404 for non-existent post ID', async () => {
            const nonExistentPostId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .delete(`/posts/${nonExistentPostId}/like`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);
    
            expect(response.status).toBe(404);
        });
    
        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .delete(`/posts/${postId}/like`)
                .set('Authorization', `invalidToken`);
    
            expect(response.status).toBe(401);
        });
    });
    
    describe('GET /posts/user/:id', () => {
        it('should get posts by user ID', async () => {
            const response = await request(app)
                .get(`/posts/user/${userId}`)
    
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            const containsPost = response.body.some((post: any) => post._id === postId);
            expect(containsPost).toBe(true);
        });
    });
    
    describe('DELETE /posts/:id', () => {
        it('should delete a post by ID', async () => {
            const response = await request(app)
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);
    
            expect(response.status).toBe(200);
        });
    
        it('should return 404 for non-existent post ID', async () => {
            const nonExistentPostId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .delete(`/posts/${nonExistentPostId}`)
                .set('Authorization', `Bearer ${testUser.accessToken}`);
    
            expect(response.status).toBe(404);
        });
    
        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .delete(`/posts/${postId}`)
                .set('Authorization', `invalidToken`);
    
            expect(response.status).toBe(401);
        });
    });    
});