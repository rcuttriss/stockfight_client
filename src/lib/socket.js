import io from "socket.io-client";

const WEBSOCKET_API_URL = "http://localhost:3001";

const socket = io(WEBSOCKET_API_URL, {
  autoConnect: false,
});

export default socket;
