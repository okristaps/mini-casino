import { makeAutoObservable } from "mobx";

class Store {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }
}

const store = new Store();
export default store;
