class DispatchAction {
  get testValue() { return 42; }
}

class Dispatcher extends EmitterTest {
  constructor(element) {
    super(element);
  }

  willRender() {
    Emitter.dispatch(new DispatchAction());
    return true;
  }

  get expectedValue() { return 42; }

  render() {
    super.render();
    this.component.querySelector('.test-case').classList.add('success');
  }
}