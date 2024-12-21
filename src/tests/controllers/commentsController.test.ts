import request from 'supertest';
import app from '../../server';
import Comment from '../../models/comment_model';
import Post from '../../models/post_model';
import { mockedPost, mockedComment } from '../mockData';

describe('Comments Controller', () => {

  // Test adding a comment
  it('should add a new comment to a post', async () => {
    const post = await Post.create(mockedPost);
    const res = await request(app)
      .post(`/api/comments/${post.userId}`)
      .send({ post: post._id, text: mockedComment.text })
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.text).toBe(mockedComment.text);
  });

  // Test fetching comments for a post
  it('should get comments for a post', async () => {
    const post = await Post.create(mockedPost);
    const comment = await Comment.create({
      postId: post._id, 
      text: mockedComment.text,
      userId: post.userId
    });

    const res = await request(app)
      .get(`/api/comments/${post._id}`)
      .expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].text).toBe(mockedComment.text);
  });

  // Test deleting a comment
  it('should delete a comment', async () => {
    const post = await Post.create(mockedPost);
    const comment = await Comment.create({
      postId: post._id, 
      text: mockedComment.text,
      userId: post.userId
    });

    const res = await request(app)
      .delete(`/api/comments/${comment._id}/${post.userId}`)
      .expect(200);

    expect(res.body.message).toBe('Comment deleted successfully');
  });
});
