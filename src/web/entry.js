/** @format */

import '_shared/styles/index.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import './test.scss';

import { render, Component } from 'inferno';
import loadAsyncComponent from 'inferno-async-component';
import { HashRouter, Switch, Route } from 'inferno-router';

// routes
import Home from './routes/Home';
import About from './routes/About';

const Topbar = loadAsyncComponent(
  import(/* webpackChunkName: 'Topbar' */ '_shared/navigations/Topbar')
);

function App () {
  this.componentDidMount = () => {
    console.warn('This will be deleted'); // eslint-disable-line

    let a = 'Default value';

    /** @delete */
    a = 'new value';
    /** @enddelete */

    console.log('The value of a is', a); // eslint-disable-line
  };

  this.render = () => {
    console.log(env); // eslint-disable-line

    return (
      <>
        <Topbar />
        <HashRouter>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/about" exact={true} component={About} />
          </Switch>
        </HashRouter>
      </>
    );
  };

  return this;
}

App.prototype = Component.prototype;
App.prototype.constructor = App;

const targetElement = document.getElementById('app');
render(<App />, targetElement);
