import { LevelsModal } from "@components/index";
import { useWebSocketContext } from "@contexts/index";
import { observer } from "mobx-react";
import Game from "./game";

const App = observer(() => {
  const { store } = useWebSocketContext();

  return <div className="body">{store.levelSettings.gameStarted ? <Game /> : <LevelsModal />}</div>;
});

export default App;
