const ApiError = require('../../common/ApiError');
const billRepository = require('./bill.repository');
const Transaction = require('../transactions/transaction.model');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Derives a display status from dates/installments without mutating stored data on every read.
const withComputedStatus = (bill) => {
  const obj = bill.toObject ? bill.toObject() : bill;

  if (obj.status === 'Completed') return obj;

  const daysUntilDue = Math.ceil((new Date(obj.nextDueDate) - new Date()) / MS_PER_DAY);
  let status = 'Upcoming';
  if (daysUntilDue < 0) status = 'Overdue';
  else if (daysUntilDue <= obj.reminderDaysBefore) status = 'Due';

  return { ...obj, status, daysUntilDue };
};

const listBills = async () => {
  const bills = await billRepository.findAllSorted();
  return bills.map(withComputedStatus);
};

const listUpcoming = async (withinDays = 7) => {
  const bills = await billRepository.findUpcoming(withinDays);
  return bills.map(withComputedStatus);
};

const createBill = (body, user) => billRepository.create({ ...body, createdBy: user._id });

const updateBill = async (id, body) => {
  const existing = await billRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('Bill not found');
  }
  return billRepository.updateById(id, body);
};

const deleteBill = async (id) => {
  const existing = await billRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('Bill not found');
  }
  await billRepository.deleteById(id);
};

const advanceDueDate = (date, recurrence) => {
  const next = new Date(date);
  if (recurrence === 'Weekly') next.setDate(next.getDate() + 7);
  else if (recurrence === 'Monthly') next.setMonth(next.getMonth() + 1);
  else if (recurrence === 'Yearly') next.setFullYear(next.getFullYear() + 1);
  return next;
};

const markPaid = async (id, user) => {
  const bill = await billRepository.findById(id);
  if (!bill) {
    throw ApiError.notFound('Bill not found');
  }

  await Transaction.create({
    amount: bill.amount,
    type: 'Expense',
    category: bill.category,
    date: new Date(),
    notes: `Bill payment: ${bill.name}`,
    createdBy: user._id
  });

  const installmentsPaid = bill.installmentsPaid + 1;
  const isDone = bill.recurrence === 'One-time'
    || (bill.totalInstallments && installmentsPaid >= bill.totalInstallments);

  const update = {
    installmentsPaid,
    lastPaidDate: new Date(),
    status: isDone ? 'Completed' : 'Upcoming',
    nextDueDate: isDone ? bill.nextDueDate : advanceDueDate(bill.nextDueDate, bill.recurrence)
  };

  return billRepository.updateById(id, update);
};

module.exports = { listBills, listUpcoming, createBill, updateBill, deleteBill, markPaid };
