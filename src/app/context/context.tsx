import WebSocketStore from "@stores/store";
import { ReactNode, createContext, useContext } from "react";

type WebSocketContextType = {
  store: typeof WebSocketStore;
};

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  return (
    <WebSocketContext.Provider value={{ store: WebSocketStore }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
}
