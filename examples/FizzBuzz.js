import Emitter from '/emitter.js';

export default class FizzBuzz extends Emitter {
  constructor(element) {
    super(element);
    console.log(element)
    this.label = this.component.querySelector('p > span');
  }

  getInitialState() {
    return {count: 0};
  }

  increment() {
    this.setState({count: this.state.count + 1});  
  }
  
  stateDidChange() {
    this.childNodes(OtherFizzBuzz).forEach(element => element.instance.increment());
  }

  componentWillRender() {
    console.log(this.state.count > 0)
    return this.state.count > 0;
  }
  
  render() {
    if (this.state.count % 15 === 0) {
      this.label.innerText = 'FizzBuzz!';
    } else if (this.state.count % 3 === 0) {
      this.label.innerText = 'Fizz!';  
    } else if (this.state.count % 5 === 0) {
      this.label.innerText = 'Buzz!';  
    } else {
      this.label.innerText = '' + this.state.count;
    }
  }
}

export class OtherFizzBuzz extends FizzBuzz { }