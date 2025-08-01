const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now you can access userId in other routes
    next(); // move to the next middleware or route
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
