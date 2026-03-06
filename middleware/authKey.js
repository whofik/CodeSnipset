const SECRET_KEY = process.env.secretKey;

function authKey(req, res, next) {
  const secretKey = req.headers['secret_key'] || req.body['secret_key'];

  if (!secretKey) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Secret key required'
    });
  }

  if (secretKey !== SECRET_KEY) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid secret key'
    });
  }

  next();
}

module.exports = {
  authKey
};
