// Every endpoint responds with the same envelope so the frontend
// never has to guess the shape of a response.
function ok(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data, errors: null });
}

function created(res, data = null, message = 'Created') {
  return ok(res, data, message, 201);
}

function fail(res, statusCode = 400, message = 'Something went wrong', errors = null) {
  return res.status(statusCode).json({ success: false, message, data: null, errors });
}

module.exports = { ok, created, fail };
