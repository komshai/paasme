# Paasme Backend API

🚀 Local Service Directory Platform Backend - Production Ready

## Features

✅ **Authentication**
- OTP-based login (Phone)
- Email/Password registration
- JWT token management
- Admin panel

✅ **User Management**
- Customer profiles
- Provider profiles with verification
- User reviews & ratings

✅ **Booking System**
- Create, view, update bookings
- Real-time status tracking
- Rating & review system
- Payment tracking

✅ **Service Management**
- Service categories
- Provider listings
- Service search & filter
- Popular services

✅ **Admin Dashboard**
- Analytics & statistics
- User management
- Provider approval
- Booking monitoring

✅ **Provider Dashboard**
- Booking management
- Earnings tracking
- Profile management
- Customer reviews

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Mongoose** - ODM

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/komshai/paasme.git
cd paasme/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. MongoDB Setup
- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get connection string
- Add to `.env` as `MONGODB_URI`

### 5. Start Server
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### 🔐 Authentication
```
POST   /api/auth/send-otp           - Send OTP to phone
POST   /api/auth/verify-otp         - Verify OTP & Login
POST   /api/auth/register           - Email/Password signup
POST   /api/auth/login              - Email/Password login
GET    /api/auth/me                 - Get current user
POST   /api/auth/logout             - Logout
```

### 👤 User Management
```
GET    /api/users/profile           - Get user profile
PATCH  /api/users/profile           - Update profile
POST   /api/users/change-password   - Change password
GET    /api/users/:userId/reviews   - Get user reviews
```

### 📅 Bookings
```
POST   /api/bookings                - Create booking
GET    /api/bookings/my-bookings    - Get my bookings
GET    /api/bookings/provider       - Get provider bookings
GET    /api/bookings/:bookingId     - Get booking details
PATCH  /api/bookings/:id/status     - Update status
PATCH  /api/bookings/:id/rate       - Add rating/review
PATCH  /api/bookings/:id/cancel     - Cancel booking
```

### 🔧 Services
```
GET    /api/services                - List all services
GET    /api/services/:serviceId     - Get service details
POST   /api/services                - Create service (admin)
PATCH  /api/services/:id            - Update service (admin)
GET    /api/services/categories/list - Get categories
```

### 👨‍💼 Providers
```
GET    /api/providers               - List all providers
GET    /api/providers/:providerId   - Provider details
PATCH  /api/providers/profile       - Update profile
GET    /api/providers/dashboard/stats - Dashboard stats
```

### 🛠️ Admin
```
GET    /api/admin/dashboard         - Dashboard stats
GET    /api/admin/users             - List all users
GET    /api/admin/bookings          - List all bookings
PATCH  /api/admin/approve-provider/:id - Approve provider
GET    /api/admin/analytics         - Platform analytics
PATCH  /api/admin/users/:id/deactivate - Deactivate user
```

## Example Usage

### 1. Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+91XXXXXXXXXX"}'
```

### 2. Verify OTP & Login
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+91XXXXXXXXXX","otp":"123456"}'
```

### 3. Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId":"SERVICE_ID",
    "providerId":"PROVIDER_ID",
    "bookingDate":"2024-12-25",
    "timeSlot":{"start":"10:00 AM","end":"11:00 AM"},
    "location":{"street":"123 Main St","city":"Ahmedabad","state":"Gujarat"},
    "amount":500
  }'
```

### 4. Get Provider Dashboard
```bash
curl -X GET http://localhost:5000/api/providers/dashboard/stats \
  -H "Authorization: Bearer YOUR_PROVIDER_TOKEN"
```

## Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String (unique),
  password: String,
  userType: 'customer' | 'provider' | 'admin',
  isVerified: Boolean,
  provider: {
    businessName: String,
    category: String,
    description: String,
    ratings: Number,
    isApproved: Boolean
  },
  address: {
    street, city, state, zipCode, country
  }
}
```

### Booking Model
```javascript
{
  bookingId: String (unique),
  customerId: ObjectId,
  providerId: ObjectId,
  serviceId: ObjectId,
  bookingDate: Date,
  timeSlot: { start, end },
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled',
  amount: Number,
  rating: Number (1-5),
  review: String
}
```

## Deployment

### Heroku
```bash
# Login
heroku login

# Create app
heroku create paasme-backend

# Add MongoDB
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

### Render
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

### AWS EC2
```bash
# SSH into instance
ssh -i key.pem ec2-user@instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs

# Clone & setup
git clone repo-url
cd paasme/backend
npm install
pm2 start server.js
```

## Security

- ✅ Password hashing with bcrypt
- ✅ JWT token validation
- ✅ CORS protection
- ✅ Input validation
- ✅ Environment variables
- ✅ Admin middleware

## Troubleshooting

### MongoDB Connection Error
```
Make sure MongoDB URI is correct in .env
Check network access in MongoDB Atlas
```

### Port Already in Use
```bash
# Change PORT in .env or kill process
lsof -i :5000
kill -9 <PID>
```

### JWT Token Expired
- Get new token by logging in again
- Token expires in 30 days by default

## Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## License

MIT License - See LICENSE file

## Support

📧 Email: support@paasme.com
💬 Issues: GitHub Issues
📱 WhatsApp: +91-XXXXXXXXXX

---

Built with ❤️ by Paasme Team
