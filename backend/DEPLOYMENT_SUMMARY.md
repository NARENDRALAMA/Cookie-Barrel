# 🚀 Cookie Barrel Backend - VPS Deployment Setup Complete!

## ✅ Changes Made

### 1. **Server Configuration** (`backend/server.js`)
- ✅ Added `dotenv` configuration to load environment variables
- ✅ Changed server binding to `0.0.0.0` (accessible from all network interfaces)
- ✅ Updated CORS to allow requests from mobile apps and production domains
- ✅ Made CORS configurable via `ALLOWED_ORIGINS` environment variable

### 2. **Environment Setup**
- ✅ Renamed `.env.local` → `.env` (standard practice)
- ✅ Added `NODE_ENV=production` for production mode
- ✅ Created `.env.example` template for VPS deployment
- ✅ Updated `.gitignore` to protect sensitive files

### 3. **Production Tools**
- ✅ Created `ecosystem.config.js` for PM2 process management
- ✅ Added PM2 scripts to `package.json`:
  - `npm run prod` - Start with PM2
  - `npm run stop` - Stop server
  - `npm run restart` - Restart server
  - `npm run logs` - View logs

### 4. **Documentation**
- ✅ `VPS_DEPLOYMENT.md` - Complete step-by-step deployment guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - Quick checklist for deployment
- ✅ Includes Nginx configuration, SSL setup, and troubleshooting

## 🌐 Current Status

Your backend is now configured to:
- ✅ Accept connections from any network (local + VPS)
- ✅ Work with CORS for mobile apps
- ✅ Load environment variables properly
- ✅ Run in production mode

## 📱 For Your Flutter App

Update your API URL based on environment:

### Local Testing (Your Network)
```dart
final String BASE_API_URL = 'http://192.168.101.25:5001/api';
```

### Production (After VPS Deployment)
```dart
// With domain and SSL (recommended)
final String BASE_API_URL = 'https://yourdomain.com/api';

// Or with VPS IP only
final String BASE_API_URL = 'http://YOUR_VPS_IP/api';
```

## 🖥️ VPS Deployment Steps (Quick)

1. **Get a VPS** (DigitalOcean, Linode, Vultr, etc.)
   - Minimum: 1 CPU, 1-2GB RAM, Ubuntu 20.04+
   - Cost: ~$4-6/month

2. **SSH into VPS**
   ```bash
   ssh root@YOUR_VPS_IP
   ```

3. **Run Setup Commands**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   
   # Clone your repo
   cd /var/www
   git clone https://github.com/NARENDRALAMA/Cookie-Barrel.git
   cd Cookie-Barrel/backend
   
   # Install dependencies
   npm install --production
   
   # Create .env file (copy from .env.example and fill in values)
   nano .env
   
   # Update ecosystem.config.js path
   nano ecosystem.config.js
   # Change cwd to: /var/www/Cookie-Barrel/backend
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup  # Follow instructions
   ```

4. **Configure Nginx** (See `VPS_DEPLOYMENT.md` for full config)

5. **Setup Firewall**
   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw allow OpenSSH
   sudo ufw enable
   ```

6. **Test Your API**
   ```bash
   curl http://YOUR_VPS_IP/api/health
   ```

## 🔐 Security Checklist

- [ ] **MongoDB Atlas**: Whitelist VPS IP or `0.0.0.0/0`
- [ ] **JWT Secret**: Use a strong random string in production
- [ ] **SSL Certificate**: Setup with Let's Encrypt (optional but recommended)
- [ ] **Environment Variables**: Never commit `.env` files
- [ ] **Regular Updates**: Keep system and packages updated

## 📊 MongoDB Atlas Configuration

**Important!** Update MongoDB Atlas Network Access:
1. Go to https://cloud.mongodb.com
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. Add your VPS IP address OR
5. Add `0.0.0.0/0` to allow from anywhere (less secure but easier)

## 🧪 Testing Endpoints

After deployment, test all endpoints:

```bash
# Replace YOUR_VPS_IP with actual IP
BASE_URL="http://YOUR_VPS_IP/api"

# Health check
curl $BASE_URL/health

# Register
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","phone":"1234567890","password":"password123"}'

# Login
curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get products
curl $BASE_URL/products
```

## 📁 Files Created/Modified

### Created:
- `backend/.env.example` - Environment template
- `backend/ecosystem.config.js` - PM2 configuration
- `backend/VPS_DEPLOYMENT.md` - Detailed deployment guide
- `backend/DEPLOYMENT_CHECKLIST.md` - Quick checklist

### Modified:
- `backend/server.js` - Network and CORS configuration
- `backend/.env` - Production environment variables
- `backend/package.json` - Added PM2 scripts
- `.gitignore` - Added logs and PM2 files

## 🎯 Next Steps

1. ✅ **Local Testing**: Test with your Flutter app on local network
2. 🔲 **Get VPS**: Choose a provider and create instance
3. 🔲 **Deploy**: Follow `VPS_DEPLOYMENT.md` guide
4. 🔲 **Configure MongoDB**: Whitelist VPS IP
5. 🔲 **Setup Domain** (Optional): Point domain to VPS
6. 🔲 **Install SSL** (Optional): Use Certbot for HTTPS
7. 🔲 **Update Flutter App**: Change BASE_API_URL to production URL
8. 🔲 **Test Production**: Verify all endpoints work

## 🆘 Need Help?

- Check `VPS_DEPLOYMENT.md` for detailed instructions
- Check `DEPLOYMENT_CHECKLIST.md` for step-by-step checklist
- Common issues and solutions are documented

## 📞 Support Commands

```bash
# On VPS, view application status
pm2 status

# View logs
pm2 logs cookie-barrel-api

# Restart application
pm2 restart cookie-barrel-api

# Monitor resources
pm2 monit
```

---

**Your backend is ready for deployment! 🎉**

Follow the guides in `VPS_DEPLOYMENT.md` and `DEPLOYMENT_CHECKLIST.md` for a smooth deployment process.
