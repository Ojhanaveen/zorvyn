require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const adminData = {
  name: 'Admin',
  email: 'admin@zorvyn.com',
  password: 'admin@12345',
  role: 'Admin',
  status: 'Active'
};

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    let admin = await User.findOne({ email: adminData.email });
    if (admin) {
      console.log('⚠️ Admin user exists, updating password...');
      admin.password = adminData.password;
      admin.name = adminData.name;
      await admin.save();
    } else {
      admin = await User.create(adminData);
      console.log(' New Admin user created successfully');
    }
    console.log(` Admin account is ready: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
