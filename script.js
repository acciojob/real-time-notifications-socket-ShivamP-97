const statusDiv = document.getElementById("status");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const disconnectButton = document.getElementById("disconnect-button");
const notificationsDiv = document.getElementById("notifications");

const wsUrl = "wss://socketsbay.com/wss/v2/1/demo/";
let socket = null;
let reconnectTimer = null;

const displayNotification = (message) => {
  const div = document.createElement("div");
  div.textContent = message;
  notificationsDiv.appendChild(div);
};

const connectWebSocket = () => {
  statusDiv.textContent = "Connecting...";
  socket = new WebSocket(wsUrl);

  socket.addEventListener("open", () => {
    statusDiv.textContent = "Connected";

    messageInput.disabled = false;
    sendButton.disabled = false;
    disconnectButton.disabled = false;

    displayNotification("Connected to server");

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  });

  socket.addEventListener("message", (event) => {
    displayNotification(`Notification: ${event.data}`);
  });

  socket.addEventListener("error", () => {
    console.log("WebSocket error");
  });

  socket.addEventListener("close", () => {
    statusDiv.textContent = "Disconnected";

    messageInput.disabled = true;
    sendButton.disabled = true;
    disconnectButton.disabled = true;

    displayNotification("Disconnected from server");

    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        displayNotification("Attempting to reconnect...");
        connectWebSocket();
      }, 10000);
    }
  });
};

sendButton.addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if (!msg) return;

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(msg);
    displayNotification(`You: ${msg}`);
    messageInput.value = "";
  }
});

disconnectButton.addEventListener("click", () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
});

connectWebSocket();
