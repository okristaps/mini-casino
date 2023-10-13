import Grid from "@components/grid/grid";
import WebSocketComponent from "@components/webSocketComponent";

function App() {
  return (
    <>
      <Grid size={25} />
      <WebSocketComponent />
    </>
  );
}

export default App;
