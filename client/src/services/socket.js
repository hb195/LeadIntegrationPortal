const WS_URL = 'ws://localhost:8080';

// Opens a native WebSocket. Forwards parsed { type, data } messages to
// onMessage, and reports open/close so callers can drive a connection
// indicator and their own reconnect logic. No backoff/retry built in here.
export function connectSocket({ onMessage, onOpen, onClose } = {}) {
  const socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    onOpen?.();
  };

  socket.onmessage = (event) => {
    try {
      onMessage?.(JSON.parse(event.data));
    } catch {
      // ignore malformed messages
    }
  };

  socket.onclose = () => {
    onClose?.();
  };

  return socket;
}
