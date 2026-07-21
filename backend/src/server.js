require('./config/env'); // validates required env vars before anything else runs
const app = require('./app');
const { port } = require('./config/env');

const server = app.listen(port, () => {
  console.log(`RenewCred backend listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
  server.close(() => process.exit(1));
});
