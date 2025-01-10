

const request = require('supertest');
const server = require('../index');  // Import your Express app
const mongoose = require("mongoose")
const User = require("../models/user")
describe('Auth Routes', () => {

  let mockUseSignIn, mockUseSignUp;

  /// sign up
  it('should sign up a new user', async () => {
    const res = await request(server)
      .post('/api/user/signup')
      .send({
        "name": "s d sawant",
        "email": "userTest1@gmail.com",
        "password": "12345",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('User signed up successfully');

    // Save the created user for later cleanup
    mockUseSignUp = await User.findOne({ email: 'userTest1@gmail.com' });
  });

  it("should fail to sign up a user with missing fields", async () => {
    const res = await request(server)
      .post("/api/user/signup")
      .send({
        email: "userTest2@gmail.com",
        password: "12345",
      }); // Missing 'name' field

    expect(res.status).toBe(422); // Validation error code
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({ msg: "Name must be at least 3 characters long" })
    );
  });

  // Sign up a new user for sign-in testing
  beforeAll(async () => {
    // new user in database
    const user = new User({
      name: "s d sawant",
      email: "userTest2@gmail.com",
      password: "12345",
    });
    mockUseSignIn = await user.save();
  });

  it('should sign in an existing user', async () => {
    const res = await request(server)
      .post('/api/user/signin')
      .send({
        email: 'userTest2@gmail.com',
        password: '12345',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('User signed in successfully');
  });

  it('should return 401 if password does not match', async () => {
    const res = await request(server)
      .post('/api/user/signin')
      .send({
        email: 'userTest2@gmail.com',
        password: '123456',
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('password does not match.');
  });

  it('should return 404 if user does not exist', async () => {
    const res = await request(server)
      .post('/api/user/signin')
      .send({
        email: 'userTest3@gmail.com',
        password: '12345',
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User does not exists');
  });

  it('should sign out a user successfully', async () => {
    const signinRes  = await request(server)
      .post('/api/user/signin')
      .send({
        email: 'userTest2@gmail.com',
        password: '12345',
      });

    const cookie = signinRes.headers['set-cookie'][0];  // Get the cookie from the signin response

    const res = await request(server)
      .get('/api/user/signout')
      .set('Cookie', cookie);  // Attach the cookie from the signin response
    
      expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('User signout successful');
  });

  
  afterAll(async () => {
    await User.deleteMany({ email: mockUseSignIn.email });
    await User.deleteMany({ email: mockUseSignUp.email });
    server.close();
    mongoose.connection.close();
  })
});
