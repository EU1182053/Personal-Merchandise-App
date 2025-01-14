const request = require('supertest');
const app = require('../index');  // Import your Express app
const mongoose = require('mongoose');
const User = require('../models/user');
const Category = require('../models/category');

describe('Category Routes', () => {
    let adminUser, userToken, categoryId, adminId;
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
        const res = await request(app)
            .post('/api/user/signin')
            .send({
                email: 'admin@example.com',
                password: 'admin123',
            });

        userToken = res.body.token;
        adminId = res.body.user._id;


         // Create a category
         const category = new Category({
            name: 'Old Category Name',
        });
        const savedCategory = await category.save();
        categoryId = savedCategory._id;


    });

    it('should create a new category', async () => {
        const res = await request(app)
            .post(`/api/category/create/${adminUser._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Category' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('savedCategory');
        expect(res.body.savedCategory).toHaveProperty('name', 'Category');

        // Cleanup: Delete the created category
        await Category.findByIdAndDelete(res.body.savedCategory._id);
    })
    it('should list all categories', async () => {
        const res = await request(app)
            .get('/api/category/show')

        expect(res.status).toBe(200);

        expect(res.body).toHaveProperty("categories");

        expect(Array.isArray(res.body.categories)).toBe(true);

    });

    it('should update a category', async () => {
        const res = await request(app)
            .put(`/api/category/update/${adminId}/${categoryId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Updated Category Name',
            });

        // Check the response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("updatedCategory");
        expect(res.body.updatedCategory).toHaveProperty('name', 'Updated Category Name');
    });
    /// Cleanup
    afterAll(async () => {
        await Category.deleteOne({ _id: categoryId });
        await User.deleteMany({
            email: { $in: [adminUser.email] },
        });
        mongoose.connection.close();
    });
});
