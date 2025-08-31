# EdTech Project with Authentication

This project includes a complete authentication system with user registration, login, and database storage.

## Features

- **User Authentication**: Secure login and registration system
- **JWT Tokens**: Stateless authentication with JSON Web Tokens
- **Password Security**: Bcrypt hashing for secure password storage
- **Database Storage**: MongoDB integration for user data persistence
- **Protected Routes**: Secure access to authenticated content
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback

## Project Structure

```
edtech_project/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── config.env          # Environment configuration
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Authentication context
│   │   └── App.js          # Main app component
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

### 1. Backend Setup

```bash
cd edtech_project/backend

# Install dependencies
npm install

# Create environment file
cp config.env.example config.env
# Edit config.env with your MongoDB URI and JWT secret

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
cd edtech_project/frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 3. Database Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` in `config.env` to point to your MongoDB instance.

## Environment Variables

Create a `config.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/edtech_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/logout` - User logout

### Health Check

- `GET /api/health` - Server health status

## Usage

### User Registration

1. Navigate to the registration page
2. Fill in your details (name, email, password, etc.)
3. Submit the form
4. You'll be redirected to login upon successful registration

### User Login

1. Navigate to the login page
2. Enter your email and password
3. Submit the form
4. Upon successful login, you'll be redirected to the home page

### Protected Routes

- `/home` - Requires authentication
- `/quiz` - Requires authentication
- Unauthenticated users will be redirected to the login page

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure, stateless authentication
- **Input Validation**: Server-side validation with express-validator
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured CORS for security
- **Helmet**: Security headers middleware

## Database Schema

### User Model

```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: String (enum: student, teacher, admin),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Backend Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

### Frontend Development

```bash
# Start development server
npm start

# Build for production
npm run build
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `config.env`
   - Verify network access if using remote MongoDB

2. **JWT Token Issues**
   - Check JWT_SECRET in environment variables
   - Ensure token expiration is reasonable
   - Verify token format in Authorization header

3. **CORS Issues**
   - Check CORS configuration in server.js
   - Verify frontend URL is in allowed origins

4. **Port Conflicts**
   - Change PORT in config.env if 5000 is occupied
   - Update frontend API calls if backend port changes

## Production Deployment

### Environment Variables

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5000
```

### Security Considerations

- Use strong, unique JWT secrets
- Enable HTTPS in production
- Set up proper MongoDB authentication
- Configure production CORS origins
- Use environment-specific configurations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
