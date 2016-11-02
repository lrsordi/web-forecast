var React = require('react');
var PageTransition = require('react-router-page-transition');
var Link = require('react-router').Link;

var Main = React.createClass({
  render : function(){
    return (
      <div className='wrapper'>
        <header>
          <h1>Grow</h1>
          <nav>
            <ul className="main-menu">
              <li><Link to="/">Intro</Link></li>
            </ul>
          </nav>
        </header>
        <section>
          {this.props.children}
        </section>
        <footer></footer>
      </div>
    )
  }
});

module.exports = Main;
