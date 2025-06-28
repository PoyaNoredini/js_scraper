const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./app');

const port = process.env.PORT || 3000;
const listEndpoints = require('express-list-endpoints');
// Get server IP or fallback to localhost
const os = require('os');
const networkInterfaces = os.networkInterfaces();

// Get local IP (IPv4, not internal)
let localIp = 'localhost';
for (const iface of Object.values(networkInterfaces)) {
  for (const config of iface) {
    if (config.family === 'IPv4' && !config.internal) {
      localIp = config.address;
      break;
    }
  }
}

app.listen(port, () => {
  console.log(`✅ Server is running: http://${localIp}:${port}`)
});
// for see list of api 
// console.log(listEndpoints(app));

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
