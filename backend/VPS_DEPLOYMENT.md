# Cookie Barrel Backend - VPS Deployment Guide

## Prerequisites on VPS
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- PM2 process manager
- Nginx (for reverse proxy)
- Domain name (optional but recommended)

## Step 1: Initial VPS Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Create application directory
sudo mkdir -p /var/www/cookie-barrel-api
sudo chown -R $USER:$USER /var/www/cookie-barrel-api
```

## Step 2: Deploy Your Code

```bash
# Clone your repository or upload files
cd /var/www/cookie-barrel-api
git clone https://github.com/NARENDRALAMA/Cookie-Barrel.git .

# Navigate to backend directory
cd backend

# Install dependencies
npm install --production

# Create .env file with your production credentials
nano .env
```

**Contents of .env file:**
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://isha:suhant@cluster0.kaoj7jt.mongodb.net/cookie-barrel
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
```

## Step 3: Update PM2 Configuration

```bash
# Edit ecosystem.config.js
nano ecosystem.config.js
```

Update the `cwd` path to: `/var/www/cookie-barrel-api/backend`

## Step 4: Start Application with PM2

```bash
# Create logs directory
mkdir -p logs

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions that appear
```

## Step 5: Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/cookie-barrel-api
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or VPS IP

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/cookie-barrel-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 6: Configure Firewall

```bash
# Allow Nginx HTTP
sudo ufw allow 'Nginx Full'

# Allow SSH (if not already allowed)
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable
```

## Step 7: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

## Step 8: Update Flutter App Configuration

After deployment, update your Flutter app's API URL:

```dart
// For domain with SSL
final String BASE_API_URL = 'https://your-domain.com/api';

// Or for VPS IP without domain
final String BASE_API_URL = 'http://YOUR_VPS_IP/api';
```

## Useful PM2 Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs cookie-barrel-api

# Restart application
pm2 restart cookie-barrel-api

# Stop application
pm2 stop cookie-barrel-api

# Monitor
pm2 monit
```

## Testing Your Deployment

```bash
# Test locally on VPS
curl http://localhost:5001/api/health

# Test from outside (replace with your domain/IP)
curl http://your-domain.com/api/health
```

## Security Notes

1. **Change JWT Secret**: Generate a strong random secret for production
2. **MongoDB**: Ensure MongoDB Atlas has proper IP whitelist settings
3. **Environment Variables**: Never commit `.env` files to git
4. **Regular Updates**: Keep Node.js, PM2, and dependencies updated
5. **Monitoring**: Setup monitoring and error tracking (e.g., Sentry)

## Quick Deployment Script

Create a `deploy.sh` script for easy updates:

```bash
#!/bin/bash
cd /var/www/cookie-barrel-api/backend
git pull origin main
npm install --production
pm2 restart cookie-barrel-api
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Your API Endpoints

Once deployed, your API will be available at:
- Health Check: `http://your-domain.com/api/health`
- Login: `http://your-domain.com/api/auth/login`
- Register: `http://your-domain.com/api/auth/register`
- Products: `http://your-domain.com/api/products`
- Orders: `http://your-domain.com/api/orders`
- Admin: `http://your-domain.com/api/admin`

## Troubleshooting

**If the API is not accessible:**
1. Check PM2 status: `pm2 status`
2. View logs: `pm2 logs`
3. Check Nginx status: `sudo systemctl status nginx`
4. Verify firewall: `sudo ufw status`
5. Check MongoDB connection in logs

**MongoDB connection issues:**
- Ensure VPS IP is whitelisted in MongoDB Atlas
- Or whitelist all IPs: `0.0.0.0/0` (less secure)
