# Emitter

A simple, reactive component state management library. Think React, but for the rest of us.

## Why Emitter

Small projects, protoypes and rapid application development may require to iterate fast. In such cases, boilerplate code is usually kept to a minimum, and it may be desirable to use a component API with state management similar to React hooks.

## Emitter principles

- Zero or more components can be reactive.
- You define components in HTML, and change their state using an Emitter class
- Components render when their state changes (unless you prevent them from doing that)
- Components are not opinionated and their architecture is flexible

## Component lifecycle

First, define your components in your HTML. 

```html
<html>
  <body>
    <div data-emitter-class="FizzBuzz">
      <p>Count: <span>0</span></p>
      <button data-emitter-click="increment">Count++</button>
    </div>
  </body>
  <script src="emitter.js"></script>
  <script>Emitter.init()</script>
</html>
```

You'll define the component's behavior by describing its state and the events that trigger a state change. In this simple example, you'll simply separate the render logic from the state management, and you'll describe what the component should render for your known states.

By default, Emitter will dynamically load your component's class from a file named after the value of your `data-emitter-class` element (in our example, `FizzBuzz.js`.) Your component can react on any of the standard DOM events, defined as `data-emitter-*`. In this example, `FizzBuzz` will react on `click`, since we setup `data-emitter-click`. When a click happens, `FizzBuzz.increment()` is called. Your controller will handle the click accordingly; for example, you can make it so that a click on any element increments counter by moving `data-emitter-click` to the component's main `div`.

```js
class FizzBuzz extends Emitter {
  constructor() {
    super();
    this.props.button = this.component.querySelector('button');
    this.props.label = this.component.querySelector('p > span');
  }

  getInitialState() {
    return {count: 0};
  }

  increment(event) {
    if (event.target === this.props.button) {
      this.setState({count: this.state.count + 1});  
    }
    
  }
  
  stateDidChange() {
    // This is called after the state changes, but before the component renders.
  }
  
  render() {
    if (this.state.count % 15 === 0) {
      this.props.label.innerText = 'FizzBuzz!';
    } else if (this.state.count % 3 === 0) {
      this.props.label.innerText = 'Fizz!';  
    } else if (this.state.count % 5 === 0) {
      this.props.label.innerText = 'Buzz!';  
    } else {
      this.props.label.innerText = '' + this.state.count;
    }
  }
}
```
