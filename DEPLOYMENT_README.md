<!-- # 🚀 Car Rental Platform - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Backend Setup
1. **Environment Variables** - Create `backend/.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=8000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://your-backend-domain.com
```

2. **Install Dependencies**:
```bash
cd backend
npm install
```

### ✅ Frontend Setup
1. **Environment Variables** - Create `frontend/.env` file:
```env
VITE_BASE_URL=https://your-backend-domain.com
VITE_CURRENCY=₹
```

2. **Build for Production**:
```bash
cd frontend
npm run build
```

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway or Render
- **Database**: MongoDB Atlas

### Option 2: Netlify (Frontend) + Heroku (Backend)
- **Frontend**: Deploy to Netlify
- **Backend**: Deploy to Heroku
- **Database**: MongoDB Atlas

### Option 3: AWS/GCP/Azure
- **Frontend**: S3 + CloudFront
- **Backend**: EC2/App Engine/App Service
- **Database**: MongoDB Atlas

## 🔧 Production Configuration

### Backend Changes Needed:
1. Update CORS origin to your frontend domain
2. Update Google OAuth callback URLs
3. Set NODE_ENV=production
4. Use production MongoDB connection string

### Frontend Changes Needed:
1. Update API base URL to your backend domain
2. Build and optimize for production
3. Update Google OAuth redirect URLs

## 📱 Testing After Deployment
1. Test user registration/login
2. Test Google OAuth
3. Test car listing and booking
4. Test admin/owner functionality
5. Test file uploads
6. Test email functionality

## 🚨 Important Notes
- **Never commit .env files** to version control
- **Update Google OAuth** redirect URLs in Google Console
- **Test thoroughly** before going live
- **Monitor logs** for any errors
- **Set up SSL certificates** for HTTPS

## 🆘 Troubleshooting
- Check environment variables are set correctly
- Verify MongoDB connection
- Check Google OAuth configuration
- Monitor server logs for errors
- Test API endpoints individually -->
