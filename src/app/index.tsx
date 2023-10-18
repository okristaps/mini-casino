import { LevelsModal } from "@components/index";
import { useWebSocketContext } from "@contexts/index";
import { observer } from "mobx-react";
import Game from "./game";

const App = observer(() => {
  const { store } = useWebSocketContext();
  const { levelSettings } = store;

  return (
    <div className="body">
      {levelSettings.gameStarted ? <Game store={store} /> : <LevelsModal />}
    </div>
  );
});

export default App;
