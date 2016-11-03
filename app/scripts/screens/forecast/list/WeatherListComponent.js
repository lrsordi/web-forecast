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
	$lastMouseX : null,
	$lastTarget : null,
	$iniTime : null,


	getInitialState: function() {
		return {
			title:this.props.title,
			retracted : this.props.retracted,
			data : this.props.data,
			cardOpened : -1,
			itemAligned : 0,
			grabbing : false,
			grabbingMobile : false,
		};
	},

	externalPositeElements : function(pos){
		this.$currPosX = pos;
		TweenMax.to(this.$listContent, 0.5, {x : this.$currPosX, ease : Quint.easeOut, onUpdate:this.updatePos, onUpdateParams:[true]});
	},

	componentWillMount: function() {
		
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			title:nextProps.title,
			retracted : nextProps.retracted,
			data : nextProps.data,
			grabbing : false,
		});
	},

	alignToIndex : function(index, animating, doCall){
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

		if(doCall){
			this.changeBackground(index);
			this.props.onAlignToIndex(this,index);
		}
	},

	changeBackground : function(index){
		var img = "url('public/images/weather-bg/"+((window.mobileDetect.mobile() && !window.mobileDetect.tablet()) ? "mobile/" : "")+this.state.data.daily.data[index].icon+".jpg')";

		$(".background-transition").css("background-image", img);
		TweenMax.fromTo($(".background-transition"), 1, {opacity:0},{opacity:1, onComplete:this.setBg});
	},

	setBg : function(){
		$("#forecast-wrapper").css("background-image", $(".background-transition").css("background-image"));
		TweenMax.set($(".background-transition"),{opacity:0});
	},

	componentDidMount: function() {
		this.$listContent = $(ReactDOM.findDOMNode(this.refs.listContent));
		this.$listContent.width(this.state.data.daily.data.length * (Globals.CARD_WIDTH + Globals.CARD_SPACE));
		this.$cards = this.$listContent.find(".card-item");

		TweenMax.staggerFrom(this.$cards, 0.6, {y : 0, opacity:0, z : -500, ease : Quint.easeOut, delay:1}, 0.3);
		TweenMax.staggerFromTo(this.$cards, 1, {rotationY : 45},{rotationY:0, ease : Back.easeOut, delay:1, overwrite:false}, 0.3);

		this.alignToIndex(0,true,true);
		this.changeBackground(0);

		this.titleSplitText = new SplitText(ReactDOM.findDOMNode(this.refs.title),{type : "chars", position : "relative"});
		TweenMax.staggerFromTo(this.titleSplitText.chars, 1, {y : 10, opacity : 0}, {y : 0, opacity : 1, ease : Quint.easeInOut, delay:1}, 0.02);
	},

	componentDidUpdate: function(prevProps, prevState) {
		if (this.state.grabbing && !prevState.grabbing) {
			if(window.mobileDetect.mobile()){
				document.addEventListener('touchmove', this.onMouseMove);
		     	document.addEventListener('touchend', this.onMouseUp);
			}
			else{
				document.addEventListener('mousemove', this.onMouseMove);
		     	document.addEventListener('mouseup', this.onMouseUp);				
			}
	      
	    } else if (!this.state.grabbing && prevState.grabbing) {
	      document.removeEventListener('mousemove', this.onMouseMove)
	      document.removeEventListener('mouseup', this.onMouseUp)
	      document.removeEventListener('touchmove', this.onMouseMove)
	      document.removeEventListener('touchend', this.onMouseUp)	      
	    }
	},

	renderCards : function(){	
		var self = this;
		var hData = self.state.data.hourly.data.slice(0,10);
		return this.state.data.daily.data.map(function(item,index){
			return <WeatherCardComponent index={index} ref={"card"+index} hourlyEnabled={index <= 0} retracted={self.state.retracted} data={item} hourlyData={hData} key={'weahtercard'+index.toString()}/>
		});
	},

	openCard : function(index, doCall){
		var card = this.refs["card"+index];
		if(!card.props.hourlyEnabled){
			return;
		}

		card.toggleOpen();

		if(doCall){
			this.props.onOpenCard(this,index);
		}
	},

	forceCloseCard : function(index){
		var card = this.refs["card"+index];
		if(!card.props.hourlyEnabled){
			return;
		}

		card.close();		
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
				<div className={classes} ref="listContent" onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}>
				{ this.renderCards() }
				</div>
			</div>
		);
	},



	onMouseDown : function(evt){
		//if (evt.button !== 0) return;
		TweenMax.killTweensOf(this.$listContent);
		var b = false;

		if(evt.clientX == undefined){
			this.$iniMouseX = evt.touches[0].clientX;

			if($(evt.target).parents(".back-side").length){
				evt.stopPropagation();
				return;
			}

			b = true;
		}else{
			this.$iniMouseX = evt.clientX;
		}

		this.$lastMouseX = this.$iniMouseX;
		this.$iniPosX = this.$currPosX;

		this.$lastTarget = $(evt.toElement);
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
	    var self = this;
	    var currX = e.clientX;

	    if(currX == undefined && !e.touches[0]){
	    	currX = this.$lastMouseX;
	    }

	    var zel = $(e.toElement);

	    if(e.toElement == undefined){
	    	zel = $(e.target);
	    }


	    if(Math.abs(currX - this.$iniMouseX) < 10 && difTime < 1000){
	    	if(zel.parents("div.card-item").length){

	    		var cardIndex = zel.parents("div.card-item").index();
	    		if(self.state.itemAligned == cardIndex)
	    		{
	    			this.openCard(cardIndex,true);
	    		}else{
	    			this.alignToIndex(cardIndex,true, true);
	    		}
	    	}
	    	return;
	    }

	    var w = $(window).width()/2;
	    var it = -(this.$currPosX - (w-(Globals.CARD_WIDTH/2))) / (Globals.CARD_WIDTH+Globals.CARD_SPACE);
	    it = Math.round(it);

	    it = Math.max(it,0);
	    it = Math.min(it,7);

	    this.alignToIndex(it, true, true);
	  },

	onMouseMove: function (evt) {
	    if (!this.state.grabbing) return;
	    var currX = evt.clientX;

	    if(currX == undefined){
	    	currX = evt.touches[0].clientX;
	    }

	    this.$lastMouseX = currX;
	    
	    this.$currPosX = this.$iniPosX+(currX-this.$iniMouseX);

	    TweenMax.to(this.$listContent, 1, {x : this.$currPosX, ease : Quint.easeOut, onUpdate:this.updatePos});
	    evt.stopPropagation()
	    evt.preventDefault()
	},

	updatePos : function(notcall){
		var w = $(window).width()/2;

		this.$cards.each(function(evt){
			var currEl = $(this);
			var coefToCenter = (Math.abs((currEl.offset().left - w+(Globals.CARD_WIDTH/2))/Globals.CARD_WIDTH)*2);
			coefToCenter *= 0.6;
			coefToCenter = Math.min(coefToCenter,1);
			var sc = 1 - (coefToCenter * 0.2);
			TweenMax.to(currEl, 0.4, {scaleX : sc, scaleY : sc, ease : Quint.easeOut});
		});

		if(!notcall)
			this.props.onChangePos(this,this.$currPosX);
	}

});

module.exports = WeatherListComponent;