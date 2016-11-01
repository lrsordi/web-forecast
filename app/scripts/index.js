window.$ = window.jQuery = require('jquery');
var Application = require('./Application');
var ReactDOM = require('react-dom');
var React = require('react');
require('gsap');

ReactDOM.render((<Application/>), document.getElementById('app'));
