const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

beforeAll(async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is missing.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await User.deleteMany({ email: 'test_analyst@finance.com' });
    await mongoose.connection.close();
});

describe('Auth & RBAC Integration Tests', () => {

    let analystToken;

    it('should successfully register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test Analyst',
                email: 'test_analyst@finance.com',
                password: 'password123',
                role: 'analyst'
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe('test_analyst@finance.com');
    });

    it('should successfully login and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test_analyst@finance.com',
                password: 'password123'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        
        analystToken = res.body.token;
    });

    it('should fail to login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test_analyst@finance.com',
                password: 'wrongpassword'
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should block analyst from creating a financial record (Admin only)', async () => {
        const res = await request(app)
            .post('/api/records')
            .set('Authorization', `Bearer ${analystToken}`)
            .send({
                amount: 1000,
                type: 'income',
                category: 'Bonus',
                date: new Date().toISOString()
            });

        expect(res.status).toBe(403);
    });

});
