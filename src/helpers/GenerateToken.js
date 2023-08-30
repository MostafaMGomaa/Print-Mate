const jwt = require('jsonwebtoken');

module.exports = (user, res) => {
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.SECKEY,
    { expiresIn: '7d' }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'dev',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
  });

  return token;
};
