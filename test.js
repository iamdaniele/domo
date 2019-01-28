class Test extends Emitter {
  constructor() {
    super();
  }

  init() {
    this.setState({state: 1});
  }

  render() {
    console.log('render');
  }
}