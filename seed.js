require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    const existing = await User.findOne({ email: 'admin@finance.com' });
    if (existing) {
      console.log('⚠️  Admin already exists. Skipping.');
      process.exit(0);
    }

    const hashed = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@finance.com',
      password: hashed,
      role: 'admin',
    });

    console.log('✅ Admin seeded successfully!');
    console.log('📧 Email: admin@finance.com');
    console.log('🔑 Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();