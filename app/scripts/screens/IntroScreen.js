var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var Globals = require('../core/Globals');
var SpriteSheet = require('../vendors/SpriteSheet');

var classNames = require('classnames');


var IntroScreen = React.createClass({
	interval : null,
	logoSpriteWhite : null,
	$el : null,

	titleSplitText : null,
	paragraphSplitText : null,

	getInitialState: function() {
		return {
			background : Math.floor(Math.random() * 5) + 1,
		};
	},

	componentWillLeave : function(){
		alert("WILL LEAVE");
	},

	componentDidMount: function() {
		// entrance animation
		this.$el = ReactDOM.findDOMNode(this.refs["intro-screen"]);

		this.logoSpriteWhite = new SpriteSheet();
					// DOM object, total de frames, fps, width, height, path
		this.logoSpriteWhite.build($(this.$el).find("h1"), 20, 28, 106, 106, 'public/images/white_anim_logo.png');
		//this.logoSpriteWhite.start();


		// background interval
		this.interval = setInterval(this.randomBackground,5000);


		this.titleSplitText = new SplitText($(this.$el).find("div.black-deg h2"),{type : "chars", position : "relative"});
		this.paragraphSplitText = new SplitText($(this.$el).find("div.black-deg div.center-content > p"),{type : "lines", position : "absolute"});
		// entrance animation
		TweenMax.fromTo(this.$el, 0.5, {opacity : 0}, {opacity : 1, ease : Linear.easeNone});
		TweenMax.fromTo($(this.$el).find("div.black-deg"), 0.5, {opacity:0},{opacity:1, delay:0.5});
		TweenMax.fromTo($(this.$el).find("div.logo-container"), 1, {y : 10, opacity : 0},{y:0, opacity:1, ease : Quint.easeInOut, delay:0.5, onComplete:this.startSprites});

		TweenMax.staggerFromTo(this.titleSplitText.chars, 1, {y : 10, opacity : 0}, {y : 0, opacity : 1, ease : Quint.easeInOut, delay:1}, 0.02);
		TweenMax.staggerFromTo(this.paragraphSplitText.lines, 1, {y : 10, opacity : 0}, {y : 0, opacity : 1, ease : Quint.easeInOut, delay:1.5}, 0.04);

		TweenMax.fromTo($(this.$el).find("div.black-deg div.center-content a.proceed-btn"), 0.5, {y : 10, opacity : 0}, {y : 0, opacity : 1, ease : Quint.easeInOut, delay:2});
	},

	startSprites : function(){
		this.logoSpriteWhite.start();
	},

	componentWillUnmount: function() {
		TweenMax.killChildTweensOf(this.$el);

		if(this.logoSpriteWhite != null){
			this.logoSpriteWhite.stop();
			this.logoSprite = null;
		}

		if(this.titleSplitText != null){
			this.titleSplitText.revert();
			this.paragraphSplitText.revert();
			this.titleSplitText = null;
			this.paragraphSplitText = null;
		}
		clearInterval(this.interval);
	},

	randomBackground : function(){
		this.setState({background : (this.state.background+1 > 5 ? 1 : this.state.background+1)});
	},


	  render : function(){
	  	var classes = classNames({
	      'logo-container': true,
	      'inverted': (this.state.background == 3) });
	    return (
	      <div id="intro-screen" ref='intro-screen' style={{'background' : 'url(\'public/images/intro/bg'+this.state.background+'.jpg\') 0 0 no-repeat', 'backgroundSize' : 'cover'}}>
	      	<div className='black-deg'>
		      	<div className='center-content'>
		      	  <div className={classes}>
				      <h1 ref='main-logo'>Grow</h1>
			      </div>
			      <h2>Norfolk Weather</h2>
			      <p>This project was developed to show up the current forecast data from Norfolk, VA, and let you compare with another place around the world.<br/><br/><br/>Provided by <a href="http://forecast.io" target="_blank">Forecast.io.</a></p>
			      <Link to="/forecast" className="proceed-btn" title="proceed">Proceed</Link>
			    </div>
		    </div>
	      </div>
	    )
	  }
});


module.exports = IntroScreen;
