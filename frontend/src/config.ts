const dev = true;

const CONFIG = {
  SERVER_URL: dev
    ? "http://" + window.location.hostname + ":8000"
    : "https://ezqz.onrender.com",
  SOCKET_URL: dev
    ? "ws://" + window.location.hostname + ":8000/ws"
    : "wss://ezqz.onrender.com/ws",
};

export default CONFIG;
