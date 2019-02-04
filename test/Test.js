class Test extends Emitter {
  constructor(component) {
    super(component);
    this.setState({render: 1});
    this.tests = this.component.querySelectorAll('[e\\:test]');
    this.tests.forEach(el => {
      if (this[el.getAttribute('e:test')](el)) {
        el.classList.add('success');
      }
    });
  }

  load() {
    return true;
  }

  htmlAttribute(el) {
    return !!this.props[this.props.expected];
  }

  getInitialState() {
    return {state: 1};
  }

  initialState(el) {
    return JSON.stringify(this.getInitialState()) === el.getAttribute('e:expected');
  }

  childNode() {
    return this.childNodes().length === 2;
  }

  childNodeOfSpecificClass() {
    return this.childNodes(ChildNode).length === 2;
  }

  stateChange() {
    const currentState = Object.assign({}, this.state);
    this.setState(currentState);
    if (JSON.stringify(this.state) !== JSON.stringify(currentState)) {
      return false;
    }

    this.setState({state: 2});
    if (JSON.stringify(this.state) !== JSON.stringify(currentState)) {
      return true;
    }    
  }

  handler() {
    this.props.valueFromClick = '1';
  }

  hasHandler(el) {
    return !!this.props.click;
  }

  didReceive(el) {
    this.component.querySelector('[e\\:click]').click();
    return typeof this.props.valueFromClick !== 'undefined'
      && this.props.valueFromClick === el.getAttribute('e:value');
  }

  render() {
    this.component.querySelector('.className').innerText = this.constructor.name;
  }
}