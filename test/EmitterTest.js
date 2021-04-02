import Emitter from '/emitter.js';

export default class EmitterTest extends Emitter {
  constructor(element) {
    super(element);
    this.header = this.component.querySelector('.className');
  }
  render() {
    this.header.innerText = this.constructor.name;
  }
}

export class ClassFromSameModule extends Emitter {
  render() {
    super.render()
    this.component.setAttribute('class', 'test-case success');
  }
}