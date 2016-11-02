var React = require('react');
var DateHelper = require('../../../helpers/DateHelper');
var Globals = require('../../../core/Globals');
var ReactDOM = require("react-dom");
var classNames = require('classnames');

var WeatherCardComponent = React.createClass({
	$iconAnim : null,
	$el : null,



	getInitialState: function() {
		return {
			data: this.props.data,
			index : this.props.index,
			retracted : this.props.retracted,
			enabled : this.props.enabled,
			opened : false,
			hourlyData : this.props.hourlyData,
			backside : false,
		};
	},

	componentDidMount: function() {
		this.$iconAnim = new Skycons({"color": "white"});
		this.$el = ReactDOM.findDOMNode(this.refs.card);
		
		this.$iconAnim.add(ReactDOM.findDOMNode(this.refs.icon), this.state.data.icon);
		this.$iconAnim.play();
	},

	toggleOpen : function(){
		this.setState({
			opened : !this.state.opened
		})
	},

	componentDidUpdate: function(prevProps, prevState) {
		if(this.state.opened && !prevState.opened){
			TweenMax.to(this.$el, 0.5, {rotationY : 90, ease : Quint.easeIn});
			TweenMax.to(this.$el, 0.5, {rotationY : 0, ease : Quint.easeOut, delay:0.5, overwrite:false});
			TweenMax.to(this.$el, 0.5, {onComplete:this.setBackSide, overwrite:false, onCompleteParams:[true], overwrite:false});
		}else if(!this.state.opened && prevState.opened){
			TweenMax.to(this.$el, 0.5, {rotationY : -90, ease : Quint.easeIn});
			TweenMax.to(this.$el, 0.5, {rotationY : 0, ease : Quint.easeOut, delay:0.5, overwrite:false});
			TweenMax.to(this.$el, 0.5, {onComplete:this.setBackSide, overwrite:false, onCompleteParams:[false], overwrite:false});
		}

		if(this.state.backside && !prevState.backside){
			if(this.$iconAnim != null){
				this.$iconAnim.remove();
				this.$iconAnim = null;
			}
		}else if(!this.state.backside && prevState.backside){
			this.$iconAnim = new Skycons({"color": "white"});		
			//this.$iconAnim.add(ReactDOM.findDOMNode(this.refs.icon), this.state.data.icon);
			this.$iconAnim.add(ReactDOM.findDOMNode(this.refs.icon), "clear-night");
			this.$iconAnim.play();
		}


		if((this.state.enabled && !prevState.enabled)||(!this.state.enabled && prevState.enabled)){
			TweenMax.to(this.$el, 0.5, {opacity:((!this.state.enabled)?0.3:1), ease : Linear.easeNone, overwrite:false});
		}
	},

	setBackSide : function(value){
		this.setState({
			backside : value
		});
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			data : nextProps.data,
			index : nextProps.index,
			retracted : nextProps.retracted
		});
	},

	renderHourly : function(){

		return this.state.hourlyData.map(function(item,index){
			console.log(item);
			return <div className="line-hourly" key={"hourlydata"+index}>
						<div className="column-hour">{DateHelper.getAMPMHour(item.time)}</div>
						<div className="column-icon"><img src={"public/images/icons/"+item.icon+".svg"} /></div>
						<div className="column-temperature">{Math.round(item.temperature).toString() + "°"}</div>
						<div className="column-wind">{"Wind: "+Math.round(item.windSpeed).toString() + "m/h"}</div>
					</div>
		});
	},

	render: function() {
		var classes = classNames({
	      'card-item': true,
	      'retracted': this.state.retracted });
		return (
			<div className={classes} ref="card">
				{ !this.state.backside ?
					<div className="front-side">
						<div className="line-date">
							<strong>{DateHelper.getDateTitle(this.state.data.time)}</strong>
						</div>
						<div className="line-temperature">
							<div className="column-icon">
								<canvas id={"icon"+this.state.index.toString()} width="128" height="128" ref="icon"></canvas>
							</div>
							<div className="column-degrees">
								<strong className="max"><img src="public/images/arrow-up.svg"/>{Math.round(this.state.data.temperatureMax).toString() + "°"}</strong>
								<strong className="min"><img src="public/images/arrow-down.svg"/>{Math.round(this.state.data.temperatureMin).toString() + "°"}</strong>
							</div>
						</div>
						<div className="line-auxiliar-data">
							<div className="column-auxiliar">
								<strong>Wind:</strong><p>{this.state.data.windSpeed.toString() + " m/h"}</p>
								<strong>Humidity:</strong><p>{Math.round(this.state.data.humidity * 100) + "%"}</p>
								<strong>Dew Pt:</strong><p>{Math.round(this.state.data.dewPoint) + "°"}</p>
							</div>
							<div className="column-auxiliar">
								<strong>Ozone:</strong><p>{this.state.data.ozone}</p>
								<strong>Visibility:</strong><p>{(this.state.data.visibility == undefined) ? "n/a" : this.state.data.visibility + "m"}</p>
								<strong>Pressure:</strong><p>{Math.round(this.state.data.pressure) + "mb"}</p>					
							</div>
						</div>
					</div>

					: 

					<div className="back-side">
						<div className="line-date">
							<strong>{DateHelper.getDateTitle(this.state.data.time)}</strong>
						</div>
						{this.renderHourly()}
					</div>
				}
			</div>
		);
	}

});

module.exports = WeatherCardComponent;