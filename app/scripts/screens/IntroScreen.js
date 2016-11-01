var React = require('react');
var Link = require('react-router').Link;


var IntroScreen = React.createClass({
  render : function(){
    return (
      <div className="intro-container">
      <h2>Teste</h2>
      <Link to="/forecast">Manda brasa</Link>
      </div>
    )
  }
});


module.exports = IntroScreen;
