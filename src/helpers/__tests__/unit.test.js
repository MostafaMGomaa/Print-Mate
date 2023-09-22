const { isUnEmail } = require('../middlewares');
const {
  isVaildUserToken,
  restrictTo,
  protect,
  generateJWT,
} = require('../auth');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const AppError = require('../appError');
const User = require('../../models/userModel');

function setup() {
  const req = { user: {}, headers: {} };
  const res = { cookie: jest.fn() };
  const next = jest.fn();

  return { req, res, next };
}
const mockAsyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

describe('Chcek if given mail is univeristy mails', () => {
  const goodMail = ['mostafa@alex.edu.eg', '1243@alex.edu.eg'];
  const badMail = ['', 'mostafa', '5@email', 'mostafa@gmail.com'];

  goodMail.map((email) => {
    it(`Should accept '${email}' as uni mail`, () => {
      expect(isUnEmail(email)).toBe(true);
    });
  });

  badMail.map((email) => {
    it(`Should reject '${email}' as uni mail`, () => {
      expect(isUnEmail(email)).toBe(false);
    });
  });
});

describe('genJWT', () => {
  const { res } = setup();
  generateJWT({ id: 'userID', role: 'user' }, res);
  it('should has cookies', () => {
    expect(res.cookie).toHaveBeenCalledWith(
      'jwt',
      expect.any(String),
      expect.any(Object)
    );
  });
});

describe('protect function', () => {
  it('should call next() when a valid token is provided', async () => {
    const { req, res, next } = setup();

    req.authorization = 'Bearer validTokenHere';

    jwt.verify = jest.fn((token, secret, callback) => {
      callback(null, { id: 'userId' });
    });
    User.findByPk = jest.fn(() => Promise.resolve({ id: 'userId' }));
    const protectedRoute = mockAsyncHandler(protect);

    await protectedRoute(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next() with an error when no token is provided', async () => {
    const { req, res, next } = setup();

    User.findByPk = jest.fn(() => Promise.resolve(null));

    const protectedRoute = mockAsyncHandler(protect);
    await protectedRoute(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
