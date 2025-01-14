const request = require('supertest');
const app = require('../index');  // Import your Express app
const mongoose = require('mongoose');
const User = require('../models/user');

describe('Auth Routes', () => {
  let mockSignedUpUser;
  let mockSignedInUser;

  const testUser = {
    name: 's d sawant',
    email: 'userTest1@gmail.com',
    password: '12345',
  };

  const signinUser = {
    name: 's d sawant',
    email: 'userTest2@gmail.com',
    password: '12345',
  };

  /// Signup Tests
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/user/signup')
      .send(testUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'User signed up successfully');

    // Save the created user for cleanup
    mockSignedUpUser = await User.findOne({ email: testUser.email });
    expect(mockSignedUpUser).not.toBeNull();
  });

  it('should fail to sign up a user with missing fields', async () => {
    const res = await request(app)
      .post('/api/user/signup')
      .send({
        email: 'userTest2@gmail.com',
        password: '12345',
      }); // Missing 'name' field

    expect(res.status).toBe(422); // Validation error code
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({ msg: 'Name must be at least 3 characters long' })
    );
  });

  /// Signin Tests
  beforeAll(async () => {
    // Create a user for signin testing
    mockSignedInUser = await User.create(signinUser);
  });

  it('should sign in an existing user', async () => {
    const res = await request(app)
      .post('/api/user/signin')
      .send({
        email: signinUser.email,
        password: signinUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'User signed in successfully');
  });

  it('should return 401 if password does not match', async () => {
    const res = await request(app)
      .post('/api/user/signin')
      .send({
        email: signinUser.email,
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'password does not match.');
  });

  it('should return 404 if user does not exist', async () => {
    const res = await request(app)
      .post('/api/user/signin')
      .send({
        email: 'nonexistent@gmail.com',
        password: '12345',
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'User does not exists');
  });

  /// Signout Test
  it('should sign out a user successfully', async () => {
    const signinRes = await request(app)
      .post('/api/user/signin')
      .send({
        email: signinUser.email,
        password: signinUser.password,
      });

    const cookie = signinRes.headers['set-cookie'][0]; // Extract token cookie

    const res = await request(app)
      .get('/api/user/signout')
      .set('Cookie', cookie); // Send the token in the request

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'User signout successful');
  });

  /// Cleanup
  afterAll(async () => {
    await User.deleteMany({
      email: { $in: [testUser.email, signinUser.email] },
    });
    mongoose.disconnect();
    // app.close();
    // mongoose.connection.close();
  });
});
