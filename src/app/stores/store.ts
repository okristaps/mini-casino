import { makeAutoObservable } from "mobx";
import { MessageTypes, settings } from "@types";

class WebSocketStore {
  ws: WebSocket | null = null;
  balance: number = 0;
  messages: string[] = [];
  settings: settings = { betLimits: { min: 0, max: 0 }, chips: [] };
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
      const type: MessageTypes = event.data.type;

      switch (type) {
        case MessageTypes.settings:
          this.settings = event.data.payload;
          break;

        default:
          break;
      }

      this.addMessage(event.data);
    };
    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }

  sendWebSocketMessage(message: string) {
    console.log("message", message);

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
