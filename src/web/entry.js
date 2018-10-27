import { render, Component } from "inferno";

const targetElement = document.getElementById("app");

function App() {
  this.render = () => {
    return <h1>Hello, I'm the App</h1>;
  };

  return this;
}

App.prototype = Component.prototype;
App.prototype.constructor = App;

render(<App />, targetElement);
