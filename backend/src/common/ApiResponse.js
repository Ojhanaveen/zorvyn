const success = (res, statusCode, data, extra = {}) => {
  return res.status(statusCode).json({ success: true, data, ...extra });
};

const message = (res, statusCode, msg) => {
  return res.status(statusCode).json({ success: true, message: msg });
};

module.exports = { success, message };
