import { makeAutoObservable } from "mobx";

class WebSocketStore {
  ws: WebSocket | null = null;
  messages: string[] = [];
  url: string = process.env.REACT_APP_WEB_SOCKET_URL ?? "";
  constructor() {
    makeAutoObservable(this);
  }

  connectWebSocket() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      console.log("WebSocket connected");
    };
    this.ws.onmessage = (event) => {
      this.addMessage(event.data);
    };
    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }

  sendWebSocketMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    }
  }

  addMessage(message: string) {
    this.messages.push(message);
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

const store = new WebSocketStore();

export default store;
