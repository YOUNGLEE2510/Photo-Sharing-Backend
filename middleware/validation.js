const validateUserInput = (req, res, next) => {
  const { login_name, password, first_name, last_name } = req.body;

  // Validate login_name
  if (login_name && (login_name.length < 3 || login_name.length > 20)) {
    return res.status(400).json({ message: '❌ Login name must be between 3 and 20 characters' });
  }

  // Validate password
  if (password && (password.length < 6 || password.length > 50)) {
    return res.status(400).json({ message: '❌ Password must be between 6 and 50 characters' });
  }

  // Validate first_name and last_name
  if (first_name && (first_name.length < 1 || first_name.length > 50)) {
    return res.status(400).json({ message: '❌ First name must be between 1 and 50 characters' });
  }

  if (last_name && (last_name.length < 1 || last_name.length > 50)) {
    return res.status(400).json({ message: '❌ Last name must be between 1 and 50 characters' });
  }

  next();
};

const validatePhotoInput = (req, res, next) => {
  const { file_name, user_id } = req.body;

  if (!file_name) {
    return res.status(400).json({ message: '❌ File name is required' });
  }

  if (!user_id) {
    return res.status(400).json({ message: '❌ User ID is required' });
  }

  next();
};

const validateCommentInput = (req, res, next) => {
  const { comment, user_id, photo_id } = req.body;

  if (!comment || comment.trim().length === 0) {
    return res.status(400).json({ message: '❌ Comment cannot be empty' });
  }

  if (!user_id) {
    return res.status(400).json({ message: '❌ User ID is required' });
  }

  if (!photo_id) {
    return res.status(400).json({ message: '❌ Photo ID is required' });
  }

  next();
};

module.exports = {
  validateUserInput,
  validatePhotoInput,
  validateCommentInput
}; 