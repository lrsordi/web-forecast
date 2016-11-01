var React = require('react');
var PageTransition = require('react-router-page-transition');


var Main = React.createClass({
  render : function(){
    return (
      <div className='wrapper'>
        <header></header>
        <section>
          {this.props.children}
        </section>
        <footer></footer>
      </div>
    )
  }
});

module.exports = Main;
