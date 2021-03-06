const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({auth: false, message: 'No token provided.'});
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).send({auth: false, message: 'Failed to authenticate token.'});
  
      req.params.id = decoded.id;
      next();
    });
}