# Inner Balance Backend

A Node.js Express API for the Inner Balance wellness application.

## Features

- User authentication (signup/login) with JWT tokens
- MongoDB database integration
- Password hashing with bcrypt
- Protected routes with authentication middleware
- User profile management

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGO_URI` in `.env` file

3. Configure environment variables:
   - Copy `.env` and update values:
     ```
     MONGO_URI=mongodb://localhost:27017/inner-balance
     JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
     ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /login` - Login user

### Protected Routes (require Authorization header with Bearer token)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Health Check
- `GET /health` - Server health status

## Technologies Used

- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests