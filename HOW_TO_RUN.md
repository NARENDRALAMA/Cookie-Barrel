# 🚀 How to Run Cookie Barrel Project in VS Code

## Step-by-Step Guide for Demonstration

---

## 📋 **Prerequisites Check**

Before starting, make sure you have:
- ✅ **Node.js** installed (version 18 or higher)
  - Check: Open Terminal and type `node --version`
  - If not installed: Download from [nodejs.org](https://nodejs.org/)
  
- ✅ **VS Code** installed
  - Download from [code.visualstudio.com](https://code.visualstudio.com/)

---

## 🔧 **Step 1: Open Project in VS Code**

1. **Open VS Code**

2. **Open the Project Folder:**
   - Click `File` → `Open Folder...`
   - Navigate to: `/Users/chhiringlama/Downloads/Cookie Barrel`
   - Click `Open`

3. **Verify you see these folders in the left sidebar:**
   - `app/` folder
   - `lib/` folder
   - `package.json` file

---

## 📦 **Step 2: Install Dependencies**

1. **Open Terminal in VS Code:**
   - Press `` Ctrl + ` `` (backtick) OR
   - Go to `Terminal` → `New Terminal`

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   - Wait for installation to complete (this may take 1-2 minutes)
   - You should see: `added XXX packages`

---

## 🔐 **Step 3: Set Up Environment Variables**

1. **Check if `.env.local` file exists:**
   - Look in the root folder (same level as `package.json`)
   
2. **If `.env.local` doesn't exist, create it:**
   - Right-click in the root folder → `New File`
   - Name it: `.env.local`

3. **Add these variables to `.env.local`:**
   ```env
   MONGODB_URI=mongodb+srv://isha:suhant@cluster0.kaoj7jt.mongodb.net/cookie-barrel
   JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
   NODE_ENV=development
   ```

---

## ▶️ **Step 4: Run the Project**

1. **In the VS Code Terminal, run:**
   ```bash
   npm run dev
   ```

2. **You should see:**
   ```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Network:      http://0.0.0.0:3000
   
   ✓ Ready in X seconds
   ```

3. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

   OR if it says port 3001:
   ```
   http://localhost:3001
   ```

---

## 🎯 **Step 5: Test the Application**

### **Test as Regular User:**

1. **Register a new account:**
   - Go to `/register`
   - Fill in details and create account

2. **Login:**
   - Go to `/login`
   - Use your credentials

3. **Browse Menu:**
   - Click "Menu" in navbar
   - Add items to cart

4. **View Orders:**
   - Click your name in navbar → "My Orders"
   - See your order history

### **Test as Admin:**

1. **Login as Admin:**
   - Go to `/manager-login`
   - Use admin credentials

2. **Admin Dashboard:**
   - Click "Admin Dashboard" in navbar
   - View and manage orders
   - Add/Edit/Delete products
   - Mark products as Popular/Featured/New

---

## 🛑 **How to Stop the Server**

1. **In the Terminal, press:**
   ```
   Ctrl + C
   ```

2. **Confirm with `Y` if asked**

---

## 🔄 **Quick Restart**

If you make changes and want to restart:

1. Stop the server: `Ctrl + C`
2. Start again: `npm run dev`

---

## ⚠️ **Common Issues & Solutions**

### **Issue 1: Port Already in Use**
**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Option 1: Use different port
PORT=3001 npm run dev

# Option 2: Kill the process using port 3000
# On Mac:
lsof -ti:3000 | xargs kill -9
```

### **Issue 2: Module Not Found**
**Error:** `Cannot find module 'XXX'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### **Issue 3: MongoDB Connection Error**
**Error:** `MongooseServerSelectionError`

**Solution:**
- Check your `.env.local` file has correct `MONGODB_URI`
- Make sure MongoDB Atlas is accessible
- Check internet connection

### **Issue 4: Page Not Loading**
**Error:** Blank page or 404

**Solution:**
- Check Terminal for errors
- Hard refresh browser: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- Check browser console for errors (F12)

---

## 📱 **Demonstration Checklist**

Before your demo, verify:

- [ ] Project opens in VS Code
- [ ] Dependencies installed (`npm install` successful)
- [ ] Server starts (`npm run dev` works)
- [ ] Can access `http://localhost:3000` or `3001`
- [ ] Can register a new user
- [ ] Can login
- [ ] Can view menu and add to cart
- [ ] Can place an order
- [ ] Can view "My Orders"
- [ ] Admin can login
- [ ] Admin can update order status
- [ ] Admin can add/edit products
- [ ] Badges (Popular/Featured/New) show on menu

---

## 🎤 **Demo Flow Suggestion**

1. **Start:** Show homepage with featured dishes
2. **User Journey:**
   - Register new account
   - Browse menu
   - Add items to cart
   - Place order
   - Track order
   - View order history
3. **Admin Journey:**
   - Login as admin
   - Show dashboard with orders
   - Update order status
   - Add new product with badges
   - Show badges appearing on menu page

---

## 💡 **Pro Tips for Demo**

1. **Have test accounts ready:**
   - User account: email/password
   - Admin account: email/password

2. **Prepare test data:**
   - Have a few products already in database
   - Have some test orders

3. **Keep Terminal visible:**
   - So you can see if any errors occur

4. **Have browser bookmarks ready:**
   - `http://localhost:3000`
   - `http://localhost:3000/admin-dashboard`
   - `http://localhost:3000/menu`

5. **Test before demo:**
   - Run through the full flow once before your presentation

---

## 🆘 **Need Help?**

If something doesn't work:

1. **Check Terminal** for error messages
2. **Check Browser Console** (F12 → Console tab)
3. **Verify all steps** above were followed
4. **Restart everything:**
   - Stop server: `Ctrl + C`
   - Clear cache: Delete `.next` folder
   - Restart: `npm run dev`

---

## 📝 **Quick Command Reference**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run on specific port
PORT=3001 npm run dev
```

---

**Good luck with your demonstration! 🎉**

