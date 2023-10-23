import React from "react";
import { render, screen } from "@testing-library/react";
import { WebSocketProvider } from "@contexts/context";
import App from "@app/index";
import { createMockStore } from "../teststuff/createMockStore";

jest.mock("@contexts/index", () => ({
  useWebSocketContext: () => ({
    store: {
      levelSettings: {
        selectedLevel: 1,
        gameStarted: false,
      },
    },
  }),
}));

test("App component renders LevelsModal when game is not started", () => {
  render(
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  );
  const levelsModal = screen.getByText("Select Level");
  expect(levelsModal)?.toBeInTheDocument();
});

test("App component renders Game when the game is started", () => {
  jest.spyOn(require("@contexts/index"), "useWebSocketContext").mockReturnValue({
    store: {
      ...createMockStore(),
      levelSettings: {
        selectedLevel: 1,
        gameStarted: true,
      },
    },
  });

  render(
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  );

  const gameComponent = screen.getByText("Start Game");
  expect(gameComponent).toBeInTheDocument();
});
