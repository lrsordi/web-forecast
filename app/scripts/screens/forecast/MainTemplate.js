var React = require('react');
var PageTransition = require('react-router-page-transition');
var Link = require('react-router').Link;
var HeaderComponent = require('./components/HeaderComponent');
var FooterComponent = require('./components/FooterComponent');
var Globals = require('../../core/Globals');
var ReactDOM = require('react-dom');


var MainTemplate = React.createClass({
  getInitialState: function() {
    return {
      lastUpdated : Globals.NORFOLK_LAST_UPDATED,
      norfolkData : Globals.NORFOLK_LAST_DATA
    }
  },

  componentDidMount: function() {
    TweenMax.fromTo(ReactDOM.findDOMNode(this), 1,{opacity:0},{opacity:1});
  },  

  render : function(){
    return (
      <div id="forecast-wrapper">
        <HeaderComponent />
        <section id="forecast-screen" ref='forecast-screen'>
          {React.cloneElement(this.props.children, {norfolkData: this.state.norfolkData})}
        </section>
        <FooterComponent lastUpdated={this.state.lastUpdated}/>
      </div>
    )
  }
});

module.exports = MainTemplate;
