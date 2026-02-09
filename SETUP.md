# MAIZY STORE - Quick Start Guide

## 📝 Quick Setup Instructions

### Step 1: Configure Environment
1. The `.env` file has been created from the template
2. **IMPORTANT**: Update these values in `.env`:
   ```
   DB_PASSWORD=your_mysql_root_password
   JWT_SECRET=change_this_to_a_random_secret_key
   ```

### Step 2: Setup MySQL Database

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Run the schema (from MySQL prompt)
source d:/maizyweb/database/schema.sql

# Or if the above doesn't work, exit MySQL and run:
mysql -u root -p < d:/maizyweb/database/schema.sql
```

#### Option B: Using phpMyAdmin or MySQL Workbench
1. Open phpMyAdmin or MySQL Workbench
2. Create a new database called `maizy_store` (or let the schema create it)
3. Import the file: `database/schema.sql`

### Step 3: Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### Step 4: Access the Website

- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html
- **API Health Check**: http://localhost:3000/api/health

## 🔑 Default Login Credentials

### Admin Account
- **Email**: admin@maizystore.com
- **Password**: admin123
- **Access**: Admin panel + customer features

### Customer Account
- Register a new account from the website
- Or create test accounts via the register form

## ✅ Verification Checklist

After setup, verify everything works:

1. ✓ Server starts without errors
2. ✓ Database connection successful (check console log)
3. ✓ Website loads at http://localhost:3000
4. ✓ Products are displayed
5. ✓ Can register a new user
6. ✓ Can login with test account
7. ✓ Can add items to cart
8. ✓ Admin panel accessible
9. ✓ Admin can view products and orders

## 🎯 Next Steps

1. **Customize Products**: Login as admin and add/edit your products
2. **Update Branding**: Edit colors in `public/css/style.css`
3. **Configure Email**: Add email settings in `.env` for order notifications
4. **Add Payment**: Integrate payment gateway (Stripe, PayPal, etc.)
5. **Deploy**: Deploy to production server (Heroku, DigitalOcean, etc.)

## 🐛 Common Issues

### Database Connection Failed
```
Error: ER_ACCESS_DENIED_ERROR
```
**Fix**: Update `DB_PASSWORD` in `.env` with your MySQL password

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use
```
**Fix**: Change `PORT` in `.env` or kill process on port 3000

### Products Not Loading
**Fix**: 
1. Check database was imported correctly
2. Verify MySQL service is running
3. Check console for API errors

## 📞 Need Help?

Check the full README.md for detailed documentation.

---

**🎉 You're all set! Happy selling!**
