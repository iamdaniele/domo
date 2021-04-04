class TemplateWithEmitterClass extends Emitter {
  render() {
    this.component.innerText = 'Template initialized and rendered';
    this.component.hidden = false;
  }
}