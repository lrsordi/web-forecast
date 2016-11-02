var React = require('react');
var ReactDOM = require('react-dom');
var WeatherCardComponent = require('./WeatherCardComponent');

var WeatherListComponent = React.createClass({
	$listContent : null,

	getInitialState: function() {
		return {
			title:this.props.title,
			retracted : this.props.retracted,
			data : this.props.data
		};
	},

	componentDidMount: function() {
		this.$listContent = $(ReactDOM.findDOMNode(this.refs.listContent));
		this.$listContent.width(this.state.data.daily.data.length * 430);
		TweenMax.staggerFrom(this.$listContent.find(".card-item"), 0.6, {y : 40, opacity:0, z : -500, ease : Quint.easeOut}, 0.3);
		TweenMax.staggerFromTo(this.$listContent.find(".card-item"), 1, {rotationY : 45},{rotationY:0, ease : Back.easeOut, overwrite:false}, 0.3);

	},

	renderCards : function(){

		return this.state.data.daily.data.map(function(item,index){
			console.log(item);
			return <WeatherCardComponent index={index} data={item} key={'weahtercard'+index.toString()}/>
		});
	},

	render: function() {
		return (
			<div className="weather-list">
				<h2>{this.state.title}</h2>
				<div className="cards-container" ref="listContent">
				{ this.renderCards() }
				</div>
			</div>
		);
	}

});

module.exports = WeatherListComponent;