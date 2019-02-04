class FizzBuzz extends Emitter {
  constructor(element) {
    super(element);
    this.children = {};
    this.children.label = this.component.querySelector('p > span');
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
  
  render() {
    if (this.state.count % 15 === 0) {
      this.children.label.innerText = 'FizzBuzz!';
    } else if (this.state.count % 3 === 0) {
      this.children.label.innerText = 'Fizz!';  
    } else if (this.state.count % 5 === 0) {
      this.children.label.innerText = 'Buzz!';  
    } else {
      this.children.label.innerText = '' + this.state.count;
    }
  }
}