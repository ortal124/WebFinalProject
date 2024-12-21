import request from 'supertest';
import app from '../../server';
import Post from '../../models/post_model';
import { mockedPost } from '../mockData';

describe('Posts Controller', () => {

  // Test for creating a post
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts/123')
      .attach('image', './path/to/image.jpg')
      .send({ text: 'This is a new post' })
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.text).toBe('This is a new post');
  });

  // Test for getting all posts
  it('should fetch posts with pagination', async () => {
    await Post.create(mockedPost);
    const res = await request(app)
      .get('/api/posts?page=1&limit=10')
      .expect(200);

    expect(res.body).toHaveProperty('totalPosts');
    expect(res.body.totalPosts).toBeGreaterThan(0);
  });

  // Test for deleting a post
  it('should delete a post', async () => {
    const post = await Post.create(mockedPost);

    const res = await request(app)
      .delete(`/api/posts/${post._id}/123`)
      .expect(200);

    expect(res.body.message).toBe('Post deleted successfully');
  });
});
