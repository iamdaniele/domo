import Emitter from '/emitter.js';
import FizzBuzz from '/examples/fizzbuzz.js';

export default class App extends Emitter {
  constructor(component) {
    super(component);
    this.timer = null;
  }

  getInitialState() {
    return { shouldAutoIncrement: false };
  }

  toggleClick() {
    this.setState({shouldAutoIncrement: !this.state.shouldAutoIncrement});
  }

  stateDidChange() {
    if (this.state.shouldAutoIncrement) {
      this.timer = setInterval(
        () => this.childNodes(FizzBuzz).forEach(el => el.instance.increment()),
        this.dataset.tickinterval);
    } else {
      clearInterval(this.timer);
    }
  }
}