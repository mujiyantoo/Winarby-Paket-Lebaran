# Full-Stack Web Application with Vercel Deployment

A complete full-stack web application with modern architecture and Vercel deployment configuration.

## Project Structure

```
C:\Users\user\Desktop\
├── server/                    # Backend Node.js + Express
│   ├── index.js              # Entry point Express server
│   ├── package.json          # Backend dependencies
│   ├── .env.example          # Example environment variables
│   ├── models/               # Mongoose schemas
│   │   └── User.js           # User model with password hashing
│   ├── routes/               # API routes
│   │   ├── auth.js           # Authentication routes (register/login)
│   │   ├── profile.js        # Profile routes (protected)
│   │   └── health.js         # Health check route
│   └── middleware/           # Custom middleware
│       └── auth.js           # JWT authentication middleware
├── client/                   # Frontend React + Tailwind CSS
│   ├── src/                  # React source code
│   │   ├── App.jsx          # Main App component
│   │   ├── main.jsx         # Entry point
│   │   ├── index.css        # Tailwind CSS styles
│   │   ├── api/             # API helpers
│   │   │   └── auth.js      # Axios instance with interceptors
│   │   ├── components/      # Reusable components
│   │   │   └── Navbar.jsx   # Navigation component
│   │   └── pages/           # Page components
│   │       ├── Login.jsx    # Login page
│   │       ├── Register.jsx # Registration page
│   │       └── Dashboard.jsx # Dashboard page
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── postcss.config.js    # PostCSS configuration
│   └── index.html           # HTML template
├── vercel.json              # Vercel deployment configuration
├── .gitignore               # Git ignore file
└── README.md                # This file
```

## Features

### Backend (Node.js + Express)
- ✅ Modular architecture with separate routes, models, and middleware
- ✅ MongoDB Atlas integration with Mongoose
- ✅ JWT authentication with bcrypt password hashing
- ✅ Input validation with express-validator
- ✅ CORS enabled for frontend communication
- ✅ Environment variable configuration
- ✅ Health check endpoint

### Frontend (React + Tailwind CSS)
- ✅ React 18 with Vite build tool
- ✅ Tailwind CSS for responsive styling
- ✅ React Router for navigation
- ✅ Axios with request/response interceptors
- ✅ JWT token storage in localStorage
- ✅ Protected routes with authentication
- ✅ User registration and login forms
- ✅ Dashboard with profile information

### Deployment (Vercel)
- ✅ Single repository deployment configuration
- ✅ Backend API routes under `/api/*`
- ✅ Frontend static files served from root
- ✅ Build configuration for both client and server

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/yourdb?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here_change_this_to_a_long_random_string
   JWT_EXPIRE=7d
   ```

### 3. MongoDB Atlas Setup
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Replace the placeholder in `.env` file
4. Add your IP address to the whitelist

### 4. Development

```bash
# Start backend server (port 5000)
cd server
npm run dev

# Start frontend development server (port 3000)
cd ../client
npm run dev
```

### 5. Build for Production

```bash
# Build frontend
cd client
npm run build  # Outputs to client/build/

# Start production server
cd ../server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Health Check
- `GET /api/health` - Server health status

## Vercel Deployment

This project is configured for deployment on Vercel with the `vercel.json` file:

```json
{
  "version": 2,
  "builds": [
    { "src": "server/index.js", "use": "@vercel/node" },
    { "src": "client/package.json", "use": "@vercel/static-build", "config": { "distDir": "build" } }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/index.js" },
    { "src": "/(.*)", "dest": "client/$1" }
  ]
}
```

### Deployment Steps:
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

## Authentication Flow

1. User registers with name, email, and password
2. Password is hashed with bcrypt and stored in MongoDB
3. JWT token is generated and returned to client
4. Token is stored in localStorage
5. Subsequent requests include token in Authorization header
6. Protected routes verify token validity using auth middleware

## Security Considerations

- Passwords are hashed with bcrypt (salt rounds: 10)
- JWT tokens have expiration (7 days by default)
- Environment variables for sensitive data
- CORS configured for frontend origin
- Input validation on server side
- HTTPS recommended for production

## Testing the Application

1. **Start both servers**:
   ```bash
   cd server && npm run dev
   cd client && npm run dev
   ```

2. **Open browser** to `http://localhost:3000`

3. **Register a new user**:
   - Click "Sign Up" in the navbar
   - Fill in name, email, and password (min 6 characters)
   - Submit the form

4. **Login** (if not auto-logged in):
   - Use the same credentials
   - You should be redirected to the dashboard

5. **Explore the dashboard**:
   - View your profile information
   - Check authentication status
   - See application information

## Troubleshooting

### Backend won't start
- Check Node.js version (`node --version`)
- Verify MongoDB connection string
- Ensure all dependencies are installed

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check CORS configuration
- Verify proxy settings in `vite.config.js`

### Authentication issues
- Check JWT secret in `.env`
- Verify token is being saved to localStorage
- Check browser console for errors

### Build issues
- Ensure all dependencies are installed
- Check Node.js version compatibility
- Verify build configuration in `vite.config.js`

## License

MIT

## Created By

Full-Stack Web Application with Vercel deployment configuration