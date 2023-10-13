import { ReactNode, createContext, useContext, useMemo } from "react";
import WebSocketStore from "@stores/store";

type WebSocketContextType = {
  store: typeof WebSocketStore;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const store = useMemo(() => ({ store: WebSocketStore }), []);

  return <WebSocketContext.Provider value={store}>{children}</WebSocketContext.Provider>;
};

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
}
