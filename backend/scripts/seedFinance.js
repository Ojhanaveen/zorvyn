require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Transaction = require('../src/modules/transactions/transaction.model');
const User = require('../src/modules/users/user.model');
const Budget = require('../src/modules/budgets/budget.model');
const Bill = require('../src/modules/bills/bill.model');
const Goal = require('../src/modules/goals/goal.model');
const SplitExpense = require('../src/modules/splits/split.model');

const seedFinance = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    const admin = await User.findOne({ role: 'Admin' });
    if (!admin) {
      console.error('❌ No Admin user found. Run createAdmin.js first.');
      process.exit(1);
    }

    let analyst = await User.findOne({ email: 'analyst@finma.com' });
    if (!analyst) {
      analyst = await User.create({
        name: 'Asha Analyst',
        email: 'analyst@finma.com',
        password: 'analyst@12345',
        role: 'Analyst',
        status: 'Active'
      });
      console.log('✅ Sample Analyst user created (analyst@finma.com / analyst@12345)');
    }

    let viewer = await User.findOne({ email: 'viewer@finma.com' });
    if (!viewer) {
      viewer = await User.create({
        name: 'Vikram Viewer',
        email: 'viewer@finma.com',
        password: 'viewer@12345',
        role: 'Viewer',
        status: 'Active'
      });
      console.log('✅ Sample Viewer user created (viewer@finma.com / viewer@12345)');
    }

    // --- Transactions ---
    await Transaction.deleteMany({});
    console.log('🗑️ Cleared existing transactions');

    const categories = {
      Income: ['Salary', 'Freelance', 'Dividends', 'Gift'],
      Expense: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Transport', 'Healthcare']
    };

    const transactions = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const type = Math.random() > 0.3 ? 'Expense' : 'Income';
      const categoryList = categories[type];
      const category = categoryList[Math.floor(Math.random() * categoryList.length)];

      const date = new Date();
      date.setDate(now.getDate() - Math.floor(Math.random() * 180));

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
    console.log(`✅ Successfully seeded ${transactions.length} transaction records!`);

    // --- Budgets ---
    await Budget.deleteMany({});
    await Budget.insertMany([
      { category: 'Groceries', monthlyLimit: 8000, alertThresholdPercent: 80, createdBy: admin._id },
      { category: 'Entertainment', monthlyLimit: 3000, alertThresholdPercent: 75, createdBy: admin._id },
      { category: 'Transport', monthlyLimit: 4000, alertThresholdPercent: 80, createdBy: admin._id },
      { category: 'Utilities', monthlyLimit: 5000, alertThresholdPercent: 90, createdBy: admin._id }
    ]);
    console.log('✅ Seeded sample budgets');

    // --- Bills (recurring + EMI) ---
    await Bill.deleteMany({});
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 5);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 2);

    await Bill.insertMany([
      {
        name: 'Flat Rent', category: 'Rent', amount: 18000, nextDueDate: nextMonth,
        recurrence: 'Monthly', reminderDaysBefore: 5, createdBy: admin._id
      },
      {
        name: 'Car Loan EMI', category: 'EMI', amount: 12500, nextDueDate: nextWeek,
        recurrence: 'Monthly', totalInstallments: 36, installmentsPaid: 10, reminderDaysBefore: 3, createdBy: admin._id
      },
      {
        name: 'Netflix Subscription', category: 'Subscription', amount: 649, nextDueDate: nextWeek,
        recurrence: 'Monthly', reminderDaysBefore: 2, createdBy: admin._id
      }
    ]);
    console.log('✅ Seeded sample bills/EMIs');

    // --- Goals ---
    await Goal.deleteMany({});
    const diwali = new Date();
    diwali.setMonth(diwali.getMonth() + 4);

    await Goal.insertMany([
      { name: 'Diwali Trip', targetAmount: 40000, currentAmount: 12000, targetDate: diwali, createdBy: admin._id },
      { name: 'Emergency Fund', targetAmount: 100000, currentAmount: 35000, createdBy: admin._id }
    ]);
    console.log('✅ Seeded sample savings goals');

    // --- Split expenses ---
    await SplitExpense.deleteMany({});
    await SplitExpense.create({
      description: 'Team Dinner',
      totalAmount: 3000,
      category: 'Food',
      paidBy: admin._id,
      participants: [
        { user: admin._id, share: 1000, settled: true },
        { user: analyst._id, share: 1000, settled: false },
        { user: viewer._id, share: 1000, settled: false }
      ],
      createdBy: admin._id
    });
    console.log('✅ Seeded sample split expense');

    console.log('🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding finance:', error.message);
    process.exit(1);
  }
};

seedFinance();
