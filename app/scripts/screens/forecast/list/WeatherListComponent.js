var React = require('react');
var ReactDOM = require('react-dom');
var WeatherCardComponent = require('./WeatherCardComponent');
var Globals = require('../../../core/Globals');
var classNames = require('classnames');

var WeatherListComponent = React.createClass({
	$listContent : null,
	$cards : null,
	$iniPosX : null,
	$finPosX : null,
	$iniMouseX : null,
	$currPosX : null,
	titleSplitText : null,

	$iniTime : null,


	getInitialState: function() {
		return {
			title:this.props.title,
			retracted : this.props.retracted,
			data : this.props.data,
			itemAligned : 0,
			grabbing : false,
		};
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			title:nextProps.title,
			retracted : nextProps.retracted,
			data : nextProps.data,
			grabbing : false,
		});
	},

	alignToIndex : function(index, animating){
		TweenMax.killTweensOf(this.$listContent);
		this.setState({
			itemAligned : index
		})
		var finx = $(window).width()/2 - (index*(Globals.CARD_WIDTH + Globals.CARD_SPACE)) - Globals.CARD_WIDTH/2;

		// if(index == 0)
		// 	finx += Globals.CARD_SPACE;

		//if(!animating){
			this.$finPosX = finx;
			this.$currPosX = this.$finPosX;
		//}

		TweenMax.to(this.$listContent, (animating) ? 0.5 : 0, {x : finx, ease : Quint.easeOut});
		this.$cards.each(function(){
			var xcoef = 0;
			var currIndex = $(this).index();
			var currEl = $(this);
			var difIndex = Math.abs(index-currIndex);
			
			if(currIndex > index){
				xcoef = -difIndex*Globals.CARD_SPACE*(1/0.8);
				xcoef += Globals.CARD_SPACE;
			}else if(currIndex < index){
				xcoef = difIndex*Globals.CARD_SPACE*(1/0.8);
				xcoef -= Globals.CARD_SPACE;
			}


			if(currIndex != index){
				TweenMax.to(currEl, (animating) ? 1 : 0, {scaleX : 0.8, scaleY : 0.8, x : xcoef, ease : Quint.easeOut});
			}
			else{
				TweenMax.to(currEl, (animating) ? 1 : 0, {scaleX : 1, scaleY : 1, x : xcoef, ease : Quint.easeOut});
			}
		});
	},

	componentDidMount: function() {
		this.$listContent = $(ReactDOM.findDOMNode(this.refs.listContent));
		this.$listContent.width(this.state.data.daily.data.length * 430);
		this.$cards = this.$listContent.find(".card-item");

		TweenMax.staggerFrom(this.$cards, 0.6, {y : 40, opacity:0, z : -500, ease : Quint.easeOut, delay:1}, 0.3);
		TweenMax.staggerFromTo(this.$cards, 1, {rotationY : 45},{rotationY:0, ease : Back.easeOut, delay:1, overwrite:false}, 0.3);

		this.alignToIndex(0,false);

		this.titleSplitText = new SplitText(ReactDOM.findDOMNode(this.refs.title),{type : "chars", position : "relative"});
		TweenMax.staggerFromTo(this.titleSplitText.chars, 1, {y : 10, opacity : 0}, {y : 0, opacity : 1, delay:0.5, ease : Quint.easeInOut, delay:1}, 0.02);
	},

	componentDidUpdate: function(prevProps, prevState) {
		if (this.state.grabbing && !prevState.grabbing) {
	      document.addEventListener('mousemove', this.onMouseMove)
	      document.addEventListener('mouseup', this.onMouseUp)
	    } else if (!this.state.grabbing && prevState.grabbing) {
	      document.removeEventListener('mousemove', this.onMouseMove)
	      document.removeEventListener('mouseup', this.onMouseUp)
	    }
	},

	renderCards : function(){	
		var self = this;
		return this.state.data.daily.data.map(function(item,index){
			return <WeatherCardComponent index={index} retracted={self.state.retracted} data={item} key={'weahtercard'+index.toString()}/>
		});
	},

	onClickCard : function(evt){
		console.log(evt);
	},

	render: function() {
		  var classes = classNames({
	      'cards-container': true,
	      'retracted': this.state.retracted });

	      var classesList = classNames({
	      'weather-list': true,
	      'retracted': this.state.retracted });
		return (
			<div className={classesList}>
				<h2 ref="title">{this.state.title}</h2>
				<div className={classes} ref="listContent" onMouseDown={this.onMouseDown}>
				{ this.renderCards() }
				</div>
			</div>
		);
	},



	onMouseDown : function(evt){
		if (evt.button !== 0) return;
		TweenMax.killTweensOf(this.$listContent);
		this.$iniMouseX = evt.clientX;
		this.$iniPosX = this.$currPosX;

		this.setState({
			grabbing : true
		});

		this.$iniTime = new Date().getTime();
		//evt.stopPropagation();
		//evt.preventDefault();
	},

	onMouseUp: function (e) {
	    this.setState({grabbing: false});
	    e.stopPropagation();
	    e.preventDefault();

	    var difTime = new Date().getTime() - this.$iniTime;
	    if(Math.abs(e.clientX - this.$iniMouseX) < 10 && difTime < 1000){
	    	if($(e.toElement).parents("div.card-item").length){
	    		this.alignToIndex($(e.toElement).parents("div.card-item").index(),true);
	    	}
	    	return;
	    }

	    var w = $(window).width()/2;
	    var it = -(this.$currPosX - (w-(Globals.CARD_WIDTH/2))) / (Globals.CARD_WIDTH+Globals.CARD_SPACE);
	    it = Math.round(it);

	    it = Math.max(it,0);
	    it = Math.min(it,7);

	    this.alignToIndex(it, true);
	  },

	onMouseMove: function (evt) {
	    if (!this.state.grabbing) return;
	    this.$currPosX = this.$iniPosX+(evt.clientX-this.$iniMouseX);

	    TweenMax.to(this.$listContent, 1, {x : this.$currPosX, ease : Quint.easeOut, onUpdate:this.updatePos});
	    evt.stopPropagation()
	    evt.preventDefault()
	},

	updatePos : function(){
		var w = $(window).width()/2;

		this.$cards.each(function(evt){
			var currEl = $(this);
			var coefToCenter = (Math.abs((currEl.offset().left - w+(Globals.CARD_WIDTH/2))/Globals.CARD_WIDTH)*2);
			coefToCenter *= 0.6;
			coefToCenter = Math.min(coefToCenter,1);
			var sc = 1 - (coefToCenter * 0.2);
			TweenMax.to(currEl, 0.4, {scaleX : sc, scaleY : sc, ease : Quint.easeOut});
		});
	}

});

module.exports = WeatherListComponent;