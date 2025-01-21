import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import initApp from '../server';
import { IUser } from '../interfaces/IUser';
import { IComment } from '../interfaces/IComment';
import { IPost } from '../interfaces/IPost';
import userService from '../services/user_service';
import * as postService from '../services/post_service';
import { deleteComment } from '../services/comment_service';

let app: Express;

type User = IUser & {
    accessToken?: string;
    refreshToken?: string;
};

let testUser: User = {
    username: 'testuserComment',
    email: 'testcomments@user.com',
    password: 'testpassword',
};

let testPost: IPost = {
    text: 'This is a test post',
    image: '/uploads/test',
    userId: '',
    likes: []
};

let testComment: Partial<IComment> = {
    text: 'This is a test comment',
    postId: '',
};

describe('Comment Routes', () => {
    let userId = '';
    let commentId = '';
    let postId = '';

    beforeAll(async () => {
        app = await initApp();
        const user = await userService.createUser({ username: testUser.username, email: testUser.email, password: testUser.password });
        userId = user.id;
        testPost.userId = userId;

        const post = await postService.createPost(testPost);
        postId = post.id;
        testComment.postId = post.id;

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
        if (commentId) {
            await deleteComment(commentId);
        }
        if (postId) {
            await postService.deletePost(postId);
        }
        mongoose.connection.close();
    });

    describe('POST /comment', () => {
        it('should create a new comment', async () => {
            const response = await request(app)
                .post('/comments')
                .set('Authorization', `${testUser.accessToken}`)
                .send({text: testComment.text, post: testComment.postId});

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            commentId = response.body._id;
        });

        it('should return 400 for invalid request', async () => {
            const response = await request(app)
                .post('/comments')
                .set('Authorization', `${testUser.accessToken}`)
                .send({});

            expect(response.status).toBe(400);
        });

        it('should return 404 for non exist postId', async () => {
            const nonExistentPostId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .post('/comments')
                .set('Authorization', `${testUser.accessToken}`)
                .send({text: testComment.text, post: nonExistentPostId});

            expect(response.status).toBe(404);
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app)
                .post('/comments')
                .set('Authorization', `Bearer invalidToken}`)
                .send({});

            expect(response.status).toBe(401);
        });
    });

    describe('GET /comment/:post', () => {
        it('should get comments by post ID', async () => {
            const response = await request(app)
                .get(`/comments/${testComment.postId}`)
                .set('Authorization', `${testUser.accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('DELETE /comment/:commentId', () => {
        it('should delete a comment by ID', async () => {
            const response = await request(app)
                .delete(`/comments/${commentId}`)
                .set('Authorization', `${testUser.accessToken}`);

            expect(response.status).toBe(200);
        });

        it('should return 404 for non-existent comment ID', async () => {
            const nonExistentCommentId = new mongoose.Types.ObjectId().toString();
            const response = await request(app)
                .delete(`/comments/${nonExistentCommentId}`)
                .set('Authorization', `${testUser.accessToken}`);

            expect(response.status).toBe(404);
        });
    });
});