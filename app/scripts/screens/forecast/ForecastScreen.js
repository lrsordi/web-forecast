var React = require('react');
var Link = require('react-router').Link;
var ReactDOM = require('react-dom');
var WeatherListComponent = require("./list/WeatherListComponent");


var ForecastScreen = React.createClass({
	getInitialState: function() {
		return {
			comparing:false,
			norfolkData : this.props.norfolkData
		};
	},

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      norfolkData : nextProps.norfolkData
    })
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
