const dev = false;

const CONFIG = {
    SERVER_URL: dev ? "http://localhost:8000" : "https://ezqz.onrender.com",
    SOCKET_URL: dev ? "ws://localhost:8000/ws" : "https://ezqz.onrender.com/ws",
}

export default CONFIG;