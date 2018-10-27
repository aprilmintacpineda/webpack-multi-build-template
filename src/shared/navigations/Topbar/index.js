/** @format */

import './styles.scss';
import { Component } from 'inferno';

function Topbar () {
  this.render = () => {
    return (
      <div className="topbar">
        <div>
          <button>
            <i class="fas fa-bars" />
          </button>
        </div>
        <div>
          <h1>Demo Web Project</h1>
        </div>
        <div>
          <a
            href="https://github.com/aprilmintacpineda/webpack-multi-build-template"
            target="_blank"
            rel="noopener noreferrer">
            <i class="fab fa-github" />
          </a>
        </div>
      </div>
    );
  };

  return this;
}

Topbar.prototype = Component.prototype;
Topbar.prototype.constructor = Topbar;

export default Topbar;
