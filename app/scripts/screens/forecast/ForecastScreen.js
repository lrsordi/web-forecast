var React = require('react');
var Link = require('react-router').Link;
var WeatherListComponent = require("./list/WeatherListComponent");


var ForecastScreen = React.createClass({
	getInitialState: function() {
		return {
			comparing:false,
			norfolkData : this.props.norfolkData
		};
	},
    render : function(){
      return (
      	<div className="section-container">
        	<WeatherListComponent data={this.state.norfolkData} title="Norfolk, VA" retracted={this.state.comparing} />
        </div>
      )
    }
});


module.exports = ForecastScreen;
