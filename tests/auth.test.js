

const request = require('supertest');
const server = require('../index');  // Import your Express app
const mongoose = require("mongoose")

describe('Auth Routes', () => {
  
  it('should sign up a new user', async () => {
    const res = await request(server)
      .post('/api/user/signup')
      .send({
        "name":"s d sawant",
        "email":"userTest1@gmail.com",
        "password":"12345",
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('User signed up successfully');
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


  afterAll(async()=>{
    server.close();
    mongoose.connection.close();
  })
});
