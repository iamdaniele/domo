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
1. `didUpdateDataset()` (optional) triggers if the any of the component's `data-` attributes changed. This is useful to trigger a state change on DOM attribute changes.
1. `didReceiveData()` (optional) triggers if the component received a dispatched event. This is useful to capture HTTP requests coming from other components, and acts as a sort of event bus across components.
3. `componentWillRender()` (optional) triggers before rendering a component. It can be used to detect circumstances where rendering is not needed. Simply return a falsey value to avoid rendering.
4. `render()` (optional) triggers if the state changed, and only if `componentWillRender()` returned a non-falsey value. This is where your DOM manipulation should occur as a result of a state change.

DOM events attached to your component via `e:*` will cause this flow only if they call `setState()`.

## Fetching and receiving data

There are circumstances where your component needs to act on the results of data requested by another component, or when multiple independent components may need to use and render data coming from the same request. Emitter enables this pattern through `Emitter.dispatch()` and `didReceiveData()`. Anything sent via `Emitter.dispact()` will be available to any component that implements `didReceiveData()`.

```js
// You can dispatch data wherever Emitter is in scope.

Emitter.dispatch(await fetch('/pet/brownie/sound')); // returns {"name": "Brownie", "sound": "meow"}
Emitter.dispatch(await fetch('/pet/brownie/age')); // returns {"name": "Brownie", "age": 5}

class PetSound extends Emitter {
  didReceiveData(data) {
    if (!data.url.match(\/pet/\w+\/sound$/) {
      return;
    }

    const response = await data.json();
    this.setState(response);
  }
  
  render() {
    this.component.innerText = `${name} goes ${sound}`;
  }
}

class PetAge extends Emitter {
  didReceiveData(data) {
    if (!data.url.match(\/pet/\w+\/age$/) {
      return;
    }

    const response = await data.json();
    this.setState(response);
  }
  
  render() {
    this.component.innerText = `${name} is ${age}`;
  }
}
```

## Templates

Sometimes you may need to render more than one element of the same type, for example rows in a table. In this case, you can specify `<template>` element with a `for` attribute; define the DOM structure for your Emitter component inside this tag. These components are automatically cloned and initialized for you. Make sure the template's `for` value matches the `e:class` value.

```html
<body>
  <template for="PetName">
    <div e:class="PetName">/div>
  </template>
  <div e:class="Pet"></div>
</body>
```
```js
class PetName extends Emitter {
  set name(value) { this.setState({name: value}) }
  render() {
    this.component.innerText = this.state.sound;
  }
}

class Pet extends Emitter {
  constructor() {
    this.kitties = ['Bean', 'Brownie'];
  }
  render() {
    this.kitties.map(name => {
      const kitten = Emitter.template.PetName;
      kitten.name = name;
      this.component.appendChild(kitten);
    });
  }
}
```

## Contributing

Your contributions are welcome. If you want to contribute, create an issue, fork this project and create a PR that can be reviewed. Issues can be created for bugs, new features, and items like code of conduct, roadmap and community support and guidelines.

## License

MIT
