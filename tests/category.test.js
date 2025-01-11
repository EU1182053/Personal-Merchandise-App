const request = require('supertest');
const server = require('../index');  // Import your Express app
const mongoose = require('mongoose');
const User = require('../models/user');
const Category = require('../models/category');

describe('Category Routes', () => {
    let adminUser, userToken, categoryId;
    beforeAll(async () => {
        //create a admin user for testing
        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 1, // Role 1 = Admin
        });
        adminUser = await admin.save();

        // Simulate admin sign-in to get token
        const res = await request(server)
            .post('/api/user/signin')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        userToken = res.body.token;



    });

    it('should create a new category', async () => {
        const res = await request(server)
            .post(`/api/category/create/${adminUser._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Category' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('savedCategory');
        expect(res.body.savedCategory).toHaveProperty('name', 'Category');

        // Cleanup: Delete the created category
        categoryId = res.body.savedCategory._id;
        await Category.findByIdAndDelete(categoryId);
    })
    
    /// Cleanup
    afterAll(async () => {
        await User.deleteMany({
            email: { $in: [adminUser.email] },
        });
        server.close();
        mongoose.connection.close();
    });
});
