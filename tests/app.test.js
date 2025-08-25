// tests/app.test.js
const request = require('supertest');
const app = require('../nodejs/server');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Welcome to the CI/CD Practice API!');
    });

    it('should return version and timestamp', async () => {
      const res = await request(app).get('/');
      
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('memory');
    });
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const res = await request(app).get('/api/users');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('email');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid data', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const res = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(newUser.name);
      expect(res.body.email).toBe(newUser.email);
      expect(res.body).toHaveProperty('created');
    });

    it('should return error for missing name', async () => {
      const invalidUser = { email: 'test@example.com' };

      const res = await request(app)
        .post('/api/users')
        .send(invalidUser);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return error for missing email', async () => {
      const invalidUser = { name: 'Test User' };

      const res = await request(app)
        .post('/api/users')
        .send(invalidUser);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const res = await request(app).get('/non-existent-route');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Route not found');
    });
  });
});

// tests/utils.test.js - Additional utility tests
describe('Utility Functions', () => {
  describe('Environment Variables', () => {
    it('should have default port', () => {
      const defaultPort = process.env.PORT || 3000;
      expect(typeof defaultPort).toBe('number' || 'string');
    });

    it('should handle missing NODE_ENV', () => {
      const env = process.env.NODE_ENV || 'development';
      expect(typeof env).toBe('string');
    });
  });
});
