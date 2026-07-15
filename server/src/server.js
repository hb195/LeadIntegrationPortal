const http = require('http');
const app = require('./app');
const { attachWebSocketServer } = require('./ws/socketServer');

const PORT = 8080;

const server = http.createServer(app);
attachWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
