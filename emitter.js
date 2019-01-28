class Emitter {
  setState(value) {
    const newstate = JSON.stringify(value);
    if (newstate === null) {
      return true;
    }

    const oldstate = JSON.stringify(this.state);
    if (oldstate !== newstate) {
      this.state = Object.assign(this.state, JSON.parse(newstate));
      typeof this.stateDidChange === 'function' ? this.stateDidChange() : null;
      typeof this.render === 'function' ? this.render() : null;
    }
  }

  constructor(state = {}) {
    this.component = document.querySelector(`[data-emitter-class=${this.constructor.name}]`);
    this.state = state;
    this.props = {};
  }
}

document.querySelectorAll('[data-emitter-class]').forEach(async (element) => {
  const className = element.getAttribute('data-emitter-class');
  const script = document.createElement('script');
  script.setAttribute('src', `${className}.js`);
  script.setAttribute('async', '');
  script.onload = new Function(`const instance = new ${className}(${className}); instance.init(); return instance;`);

  document.head.appendChild(script);
});   