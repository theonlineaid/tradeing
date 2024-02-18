// WebSocketWorker.js

const worker = new Worker('websocket.worker.js');

function connectWebSocket(url) {
  worker.postMessage({ type: 'connect', data: { url } });
}

function requestWebSocketData() {
  worker.postMessage({ type: 'getData' });
}




export { connectWebSocket, requestWebSocketData };
