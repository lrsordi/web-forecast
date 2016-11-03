var React = require('react');
var ReactDOM = require('react-dom');
var SpriteSheet = require("../../../vendors/SpriteSheet");
var Link = require('react-router').Link;

var HeaderComponent = React.createClass({
  logoSpriteWhite : null,
  $el : null,
  $elLogo : null,


  componentDidMount: function() {
    this.$el = ReactDOM.findDOMNode(this);
    this.$elLogo = ReactDOM.findDOMNode(this.refs.logo);
    this.logoSpriteWhite = new SpriteSheet();
    this.logoSpriteWhite.build($(this.$elLogo), 20, 28, 106, 106, 'public/images/white_anim_logo.png');

    TweenMax.fromTo(ReactDOM.findDOMNode(this.refs.backbtn), 1, {opacity : 0}, {opacity : 1, y : 0, ease : Quint.easeInOut});
    TweenMax.fromTo(this.$elLogo, 1, {opacity : 0},{y : 0, opacity : 1, ease : Quint.easeInOut, onComplete:this.logoSpriteWhite.start});
  },

  render: function() {
    return (
      <header>
        <div className="header-content">
          <Link to="/" className="back-to-intro" ref="backbtn"><img src="public/images/left-arrow-back.svg"/>back to intro</Link>
          <Link to="/forecast"><h1 className='spritesheet' ref='logo'>Grow</h1></Link>
        </div>
      </header>
    );
  }

});

module.exports = HeaderComponent;
