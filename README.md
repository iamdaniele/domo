# Emitter

A simple, reactive component state management library. Think React or Vue.js, but for the rest of us.

## Why Emitter

Low overhead projects, protoypes and rapid application development may require to iterate fast. In such cases, boilerplate code is usually kept to a minimum, while it may still be desirable to use a component API with state management similar to reactive hooks. Emitter can be useful when:

- Your project is more important than its framework (for example, when you're building sample code for educational purposes, and you don't want your audience to understand and navigate your project dependencies)
- You need a small library with stable APIs and a relatively slow release cycle
- You can't be bothered with compilers, modules and packages
- You don't need scaffolding and overstructures for your code

## Emitter principles

- Zero or more components can be reactive.
- You define components in HTML, and change their state using an Emitter class
- Components render when their state changes (unless you prevent them from doing that)
- Components are not opinionated and their architecture is flexible

## Component architecture

First, define your components in your HTML. Components are identified by an `e:class` attribute.

```html
<html>
  <body>
    <div e:class="FizzBuzz">
      <p>Count: <span>0</span></p>
      <button e:click="increment">Count++</button>
    </div>
  </body>
  <script src="emitter.js"></script>
  <script>Emitter.init()</script>
</html>
```

You'll define the component's behavior by describing its state and the events that trigger a state change. In this simple example, you'll simply separate the render logic from the state management, and you'll describe what the component should render for your known states. All your defined HTML attributes will be available in your component's `this.props` dictionary (for example, an `id` attribute will be available as `this.props.id`.)

By default, Emitter will dynamically load your component's class from a file named after the value of your `e:class` element (in our example, `FizzBuzz.js`.) Your component can react on any of the standard DOM events, defined as `e:*`. In this example, `FizzBuzz` will react on `click`, since we setup `e:click`. When a click happens, `FizzBuzz.increment()` is called. Your controller will handle the click accordingly; for example, you can make it so that a click on any element increments counter by moving `e:click` to the component's main `div`.

```js
class FizzBuzz extends Emitter {
  constructor(component) {
    super(component);
    this.label = this.component.querySelector('p > span');
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
```

## Component lifecycle

1. `constructor(component)` gets called first. This is where your init logic should be. Always remember to call `super(component)` first thing.
1. `getInitialState()` (optional) contains your initial state. This can be used to initialize your state ahead of a render. No render will occur as a result of specifying this state.
1. `setState(state)` accepts the new state. If the state is different from the current state, a render will occur. If you provide the exact same state, no rendering will occur.
1. `stateDidChange()` (optional) triggers if the state changed. This is useful to trigger any non-render activities, like fetching.
1. `render()` (optional) triggers if the state changed. This is where your DOM manipulation should occur as a result of a state change.

DOM events attached to your component via `e:*` will cause this flow only if they call `setState()`.

## Contributing

Your contributions are welcome. If you want to contribute, create an issue, fork this project and create a PR that can be reviewed. Issues can be created for bugs, new features, and items like code of conduct, roadmap and community support and guidelines.

## License

MIT