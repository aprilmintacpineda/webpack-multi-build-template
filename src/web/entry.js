/** @format */

import './styles.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import { render, Component } from 'inferno';

import Topbar from '../shared/navigations/Topbar';

const targetElement = document.getElementById('app');

function App () {
  this.render = () => {
    return <Topbar />;
  };

  return this;
}

App.prototype = Component.prototype;
App.prototype.constructor = App;

render(<App />, targetElement);
