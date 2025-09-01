export const requireMessageBody = (req, res, next) => {
  const { message } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, message: 'message is required (non-empty string)' });
  }
  next();
};

export default requireMessageBody;


