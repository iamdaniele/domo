class DispatchReceiver extends Emitter {
  constructor(element) {
    super(element);
  }

  get expectedValue() { return 42; }

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