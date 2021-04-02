import Emitter from '/emitter.js';
import { DispatchAction } from '/test/Dispatcher.js';

export default class DispatchReceiver extends Emitter {
  get expectedValue() { return this.dataset.expected; }

  didReceiveData(action) {
    if (action instanceof DispatchAction && action.testValue === this.expectedValue) {
      this.setState({success: true});
    }
  }

  render() {
    if (this.state.success) {
      this.component.classList.add('success');
    }
  }
}