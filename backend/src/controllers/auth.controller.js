const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  ok(res, result, 'Login successful');
});

const logout = asyncHandler(async (req, res) => {
  // Stateless JWT: logout is a client-side token discard. Server-side
  // revocation (e.g. a token blocklist) is a documented future improvement.
  ok(res, null, 'Logout successful');
});

const me = asyncHandler(async (req, res) => {
  const admin = await authService.getProfile(req.admin.id);
  ok(res, admin, 'Profile fetched');
});

module.exports = { login, logout, me };
