import Emitter from '/emitter.js';

export default class GeneralTest extends Emitter {
  constructor(component) {
    super(component);
    this.tests = this.component.querySelectorAll('[data-test]');
    this.tests.forEach(el => {
      if (this[el.dataset.test](el)) {
        el.classList.add('success');
      }
    });

  }
  load() {
    return true;
  }

  htmlAttribute(el) {
    return !!el.dataset[el.dataset.expected];
  }

  getInitialState() {
    return {state: 1};
  }

  initialState(el) {
    return JSON.stringify(this.getInitialState()) === el.dataset.expected;
  }

  childNode() {
    return this.childNodes().length === 3;
  }

  childNodeOfSpecificClass() {
    return this.childNodes(ChildNode).length === 3;
  }

  childNodeSelectNone() {
    return this.childNodes(Number).length === 0;
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
    this.dataset.valueFromClick = '1';
  }

  hasHandler(el) {
    return !!el.dataset.click;
  }

  didReceive(el) {
    this.component.querySelector('[data-click]').click();
    return typeof this.dataset.valueFromClick !== 'undefined'
      && this.dataset.valueFromClick === el.dataset.value;
  }

  render() {
    this.component.querySelector('.className').innerText = this.constructor.name;
  }
}

export class ChildNode extends Emitter {}

export class ComponentWillRender extends Emitter {
  constructor(element) {
    super(element);
    this.item = this.component.querySelector('li');
  }

  willRender() {
    return false;
  }

  render() {
    this.item.classList.remove('success');
  }
}