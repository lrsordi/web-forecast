var React = require('react');
var DateHelper = require('../../../helpers/DateHelper');
var Globals = require('../../../core/Globals');
var ReactDOM = require("react-dom");

var WeatherCardComponent = React.createClass({
	$iconAnim : null,



	getInitialState: function() {
		return {
			data: this.props.data,
			index : this.props.index
		};
	},

	componentDidMount: function() {
		this.$iconAnim = new Skycons({"color": "white"});
		console.log(this.state.data.icon);
		this.$iconAnim.add(ReactDOM.findDOMNode(this.refs.icon), this.state.data.icon);
		this.$iconAnim.play();
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			data : nextProps.data,
			index : nextProps.index
		});
	},

	render: function() {
		return (
			<div className="card-item">
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
		);
	}

});

module.exports = WeatherCardComponent;