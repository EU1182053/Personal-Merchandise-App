const request = require('supertest');
const app = require('../index'); // Import your Express app
const mongoose = require('mongoose');
const User = require('../models/user');

describe('Auth Routes', () => {
  let mockSignedUpUser;
  let mockSignedInUser;

  const testUser = {
    name: 'S D Sawant',
    email: 'userTest1@gmail.com',
    password: '12345',
  };

  const signinUser = {
    name: 'S D Sawant',
    email: 'userTest2@gmail.com',
    password: '12345',
  };

  beforeAll(async () => {
    await User.deleteMany({}); // Ensure a clean database before running tests
    mockSignedInUser = await User.create(signinUser);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should sign up a new user', async () => {
    const res = await request(app).post('/api/user/signup').send(testUser);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'User signed up successfully');
    mockSignedUpUser = await User.findOne({ email: testUser.email });
  });

  it('should fail to sign up a user with missing fields', async () => {
    const res = await request(app)
      .post('/api/user/signup')
      .send({ email: 'userTest2@gmail.com', password: '12345' });

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({ msg: 'Name must be at least 3 characters long' })
    );
  });

  it('should sign in an existing user', async () => {
    const res = await request(app).post('/api/user/signin').send({
      email: signinUser.email,
      password: signinUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'User signed in successfully');
  });

  it('should return 401 if password is incorrect', async () => {
    const res = await request(app).post('/api/user/signin').send({
      email: signinUser.email,
      password: '12345678',
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Password does not match.');
  });

  it('should return 404 if user does not exist', async () => {
    const res = await request(app).post('/api/user/signin').send({
      email: 'nonexistent@gmail.com',
      password: '12345',
    });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'User does not exists');
  });

  it('should sign out a user successfully', async () => {
    const signinRes = await request(app).post('/api/user/signin').send({
      email: signinUser.email,
      password: signinUser.password,
    });
    const cookie = signinRes.headers['set-cookie'][0];
    const res = await request(app).get('/api/user/signout').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'User signout successful');
  });
});
