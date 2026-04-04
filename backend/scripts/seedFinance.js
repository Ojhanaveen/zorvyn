require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const seedFinance = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Find the admin user to associate transactions
    const admin = await User.findOne({ role: 'Admin' });
    if (!admin) {
      console.error('❌ No Admin user found. Run createAdmin.js first.');
      process.exit(1);
    }

    // Clear existing transactions for fresh seed
    await Transaction.deleteMany({});
    console.log('🗑️ Cleared existing transactions');

    const categories = {
      Income: ['Salary', 'Freelance', 'Dividends', 'Gift'],
      Expense: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Transport', 'Healthcare']
    };

    const transactions = [];
    const now = new Date();

    // Generate data for the last 6 months
    for (let i = 0; i < 50; i++) {
      const type = Math.random() > 0.3 ? 'Expense' : 'Income';
      const categoryList = categories[type];
      const category = categoryList[Math.floor(Math.random() * categoryList.length)];
      
      const date = new Date();
      date.setDate(now.getDate() - Math.floor(Math.random() * 180)); // Last 180 days

      transactions.push({
        amount: type === 'Income' ? Math.floor(Math.random() * 50000) + 10000 : Math.floor(Math.random() * 5000) + 100,
        type,
        category,
        date,
        notes: `Sample ${type} for ${category}`,
        status: 'Completed',
        createdBy: admin._id
      });
    }

    await Transaction.insertMany(transactions);
    console.log(`✅ Successfully seeded ${transactions.length} finance records!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding finance:', error.message);
    process.exit(1);
  }
};

seedFinance();
