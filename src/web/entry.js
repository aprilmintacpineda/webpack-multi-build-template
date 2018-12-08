/** @format */

import '_shared/styles/index.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import './test.scss';

import '_shared/registerServiceWorker';
import { render, Component } from 'inferno';
import loadAsyncComponent from 'inferno-async-component';
import { HashRouter, Switch, Route } from 'inferno-router';

// routes
import Home from './routes/Home';
import About from './routes/About';

console.log(env); // eslint-disable-line

const Topbar = loadAsyncComponent(
  import(/* webpackChunkName: 'Topbar' */ '_shared/navigations/Topbar')
);

class App extends Component {
  componentDidMount () {
    console.warn('This will be deleted'); // eslint-disable-line

    let a = 'Default value';

    /** @delete */
    a = 'new value';
    /** @enddelete */

    console.log('The value of a is', a); // eslint-disable-line
  };

  render () {
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
}

render(<App />, document.getElementById('app'));
