import { dispatch } from '/emitter.js';
import EmitterTest from '/test/EmitterTest.js'

export class DispatchAction {
  get testValue() { return "test value"; }
}

export default class Dispatcher extends EmitterTest {
  willRender() {
    dispatch(new DispatchAction());
    return true;
  }

  get expectedValue() { return 42; }

  render() {
    super.render();
    this.component.querySelector('.test-case').classList.add('success');
  }
}