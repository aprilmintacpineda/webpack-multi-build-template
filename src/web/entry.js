/** @format */

import './styles.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import { render, Component } from 'inferno';
import loadAsyncComponent from 'inferno-async-component';

const Topbar = loadAsyncComponent(
  import(/* webpackChunkName: 'Topbar' */ '../shared/navigations/Topbar')
);

function App () {
  this.render = () => {
    return <Topbar />;
  };

  return this;
}

App.prototype = Component.prototype;
App.prototype.constructor = App;

const targetElement = document.getElementById('app');
render(<App />, targetElement);
