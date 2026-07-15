const { WebSocketServer } = require('ws');

let wss = null;

// Attaches a ws server to an existing http.Server so both REST and WS
// traffic share one listening port.
function attachWebSocketServer(httpServer) {
  wss = new WebSocketServer({ server: httpServer });
  return wss;
}

// Sends { type: event, data } to every currently-open client.
// No-op if the ws server hasn't been attached yet or has no clients.
function broadcast(event, data) {
  if (!wss) return;

  const message = JSON.stringify({ type: event, data });

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

module.exports = { attachWebSocketServer, broadcast };
