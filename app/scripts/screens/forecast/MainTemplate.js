var React = require('react');
var PageTransition = require('react-router-page-transition');
var Link = require('react-router').Link;
var HeaderComponent = require('./components/HeaderComponent');
var FooterComponent = require('./components/FooterComponent');
var Globals = require('../../core/Globals');


var MainTemplate = React.createClass({
  getInitialState: function() {
    return {
      lastUpdated : Globals.NORFOLK_LAST_UPDATED,
      norfolkData : Globals.NORFOLK_LAST_DATA
    }
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
