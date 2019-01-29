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

  constructor() {
    this.component = document.querySelector(`[data-emitter-class=${this.constructor.name}]`);

    this.component.getAttributeNames().forEach(key => {
      if (key === 'data-emitter-class') {
        return false;
      }

      const event = key.replace('data-emitter-', '');
      const functionName = this.component.getAttribute(key);

      if (typeof this[functionName] !== 'function') {
        throw new TypeError(`${this.constructor.name}.${functionName} is undefined`);
      }

      this.component.addEventListener(event, this[functionName].bind(this));
    });

    this.state = typeof this.getInitialState === 'function' ? this.getInitialState() : {};
    this.props = {};
  }

  static init(path = '') {
    document.querySelectorAll('[data-emitter-class]').forEach(async (element) => {
      const className = element.getAttribute('data-emitter-class');
      const script = document.createElement('script');
      script.setAttribute('src', `${path}${className}.js`);
      script.setAttribute('async', '');
      script.onload = new Function(`const instance = new ${className}(${className}); return instance;`);

      document.head.appendChild(script);
    });   
  }
}