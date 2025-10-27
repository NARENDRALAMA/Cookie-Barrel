# VPS Deployment Checklist

## Before Deployment

- [ ] MongoDB Atlas is accessible from VPS IP (whitelist `0.0.0.0/0` or specific VPS IP)
- [ ] `.env` file has production credentials
- [ ] JWT_SECRET is a strong random string
- [ ] All dependencies are in `package.json`
- [ ] Code is pushed to GitHub

## VPS Provider Setup

Choose a VPS provider:
- **DigitalOcean** (Recommended for beginners) - $4-6/month
- **Linode** - $5/month
- **Vultr** - $5/month
- **AWS EC2** - Variable pricing
- **Hetzner** - €4/month (EU-based)

Minimum specs:
- 1 CPU core
- 1-2 GB RAM
- Ubuntu 20.04 or 22.04

## Deployment Steps

1. [ ] Create VPS instance
2. [ ] SSH into VPS: `ssh root@YOUR_VPS_IP`
3. [ ] Install Node.js 18+
4. [ ] Install PM2: `sudo npm install -g pm2`
5. [ ] Install Nginx: `sudo apt install nginx -y`
6. [ ] Clone repository to `/var/www/cookie-barrel-api`
7. [ ] Navigate to backend: `cd /var/www/cookie-barrel-api/backend`
8. [ ] Install dependencies: `npm install --production`
9. [ ] Create `.env` file with production credentials
10. [ ] Update `ecosystem.config.js` with correct path
11. [ ] Start PM2: `pm2 start ecosystem.config.js`
12. [ ] Save PM2: `pm2 save`
13. [ ] Setup PM2 startup: `pm2 startup` (follow instructions)
14. [ ] Configure Nginx (see VPS_DEPLOYMENT.md)
15. [ ] Setup firewall: `sudo ufw allow 'Nginx Full' && sudo ufw allow OpenSSH && sudo ufw enable`
16. [ ] Test API: `curl http://YOUR_VPS_IP/api/health`

## Optional (Recommended)

- [ ] Setup domain name (Namecheap, GoDaddy, etc.)
- [ ] Point domain to VPS IP (A record)
- [ ] Install SSL certificate: `sudo certbot --nginx -d yourdomain.com`
- [ ] Test HTTPS: `curl https://yourdomain.com/api/health`

## Update Flutter App

- [ ] Update BASE_API_URL in Flutter app:
  ```dart
  // With domain and SSL
  final String BASE_API_URL = 'https://yourdomain.com/api';
  
  // Or with VPS IP (no SSL)
  final String BASE_API_URL = 'http://YOUR_VPS_IP/api';
  ```

## Post-Deployment Testing

Test all endpoints:
```bash
# Health check
curl http://YOUR_VPS_IP/api/health

# Register
curl -X POST http://YOUR_VPS_IP/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890","password":"password123"}'

# Login
curl -X POST http://YOUR_VPS_IP/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get products
curl http://YOUR_VPS_IP/api/products
```

## Monitoring

- [ ] Check PM2 status: `pm2 status`
- [ ] View logs: `pm2 logs`
- [ ] Monitor resources: `pm2 monit`
- [ ] Setup alerts (optional): Use UptimeRobot or similar

## Security Hardening

- [ ] Change default SSH port
- [ ] Disable root login
- [ ] Setup SSH key authentication
- [ ] Enable automatic security updates
- [ ] Setup fail2ban
- [ ] Regular backups of MongoDB

## Quick Commands

```bash
# View application status
pm2 status

# Restart after code changes
pm2 restart cookie-barrel-api

# View real-time logs
pm2 logs cookie-barrel-api --lines 100

# Check Nginx status
sudo systemctl status nginx

# Restart Nginx after config changes
sudo systemctl restart nginx

# Test Nginx configuration
sudo nginx -t
```

## Your API URL

Once deployed, your API will be accessible at:
- **With domain**: `https://yourdomain.com/api`
- **With IP only**: `http://YOUR_VPS_IP/api`

## Need Help?

Common issues and solutions in `VPS_DEPLOYMENT.md`
