var React = require('react');



var Main = React.createClass({
  render : function(){
    return (
      <div className='general-container'>
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
