import { observer } from "mobx-react";
import store from "./stores/basicStore";

const Counter = observer(() => {
  return (
    <div>
      <p>Count: {store.count}</p>
      <button onClick={() => store.increment()}>Increment</button>
      <button onClick={() => store.decrement()}>Decrement</button>
    </div>
  );
});

export default Counter;
