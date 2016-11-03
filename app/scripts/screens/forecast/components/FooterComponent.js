var React = require('react');
var DateHelper = require('../../../helpers/DateHelper');
var ReactDOM = require('react-dom');
var ForecastLoaderHelper = require('../../../helpers/ForecastLoaderHelper');
var browserHistory = require('react-router').browserHistory;

var FooterComponent = React.createClass({
	$el : null,

	getInitialState: function() {
		return {
			lastUpdated:this.props.lastUpdated,
			loading : this.props.loading,
			loadingZipcode : false,
			zipCode : ""
		};
	},

	componentDidMount: function() {
		this.$el = ReactDOM.findDOMNode(this);

		TweenMax.fromTo(ReactDOM.findDOMNode(this.refs.lastupdated), 1, {opacity : 0}, {opacity : 1, y : 0, ease : Quint.easeInOut});
   		TweenMax.fromTo(ReactDOM.findDOMNode(this.refs.reloadbtn), 1, {opacity : 0},{y : 0, opacity : 1, ease : Quint.easeInOut});
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			loading : nextProps.loading,
			lastUpdated : nextProps.lastUpdated
		});
	},

	performZipSearch : function(){
		if(this.state.loadingZipcode) return;
		var zipcode = $(ReactDOM.findDOMNode(this.refs.input)).val();
		if(zipcode.length == 0){
			alert("Please fill in your zipcode.");
			return;
		}

		this.setState({
			loadingZipcode : true
		});
		var self = this;

		ForecastLoaderHelper.getLatLngBasedOnZipCode(zipcode).then(function(result){
			self.setState({
				loadingZipcode : false
			});
			if(result.status == "ZERO_RESULTS"){
				alert("No matches found for zipcode \"" + zipcode + "\".");
				return;
			}
			
			var objResult = result.results[0];
			var cityName = ForecastLoaderHelper.getCityNameBasedOnGoogleResponse(objResult);
			$(ReactDOM.findDOMNode(self.refs.input)).val("");
			browserHistory.push("/forecast/comparing/"+objResult.geometry.location.lat + ","+objResult.geometry.location.lng+"/"+cityName);
			
		}).fail(function(evt){
			self.setState({
				loadingZipcode : false
			});

			alert("An error occurred during the zipcode search. Please, try again.");
		});
	},

	onKeyDown : function(evt){
		if(evt.nativeEvent.code.toLowerCase() == "enter" || evt.nativeEvent.code.toLowerCase() == "numpadenter"){
			this.performZipSearch();
		}
	},


	requestUpdate : function(){
		if(this.state.loading) return;

		this.props.onRequestUpdate();
	},


	render: function() {
		return (
			<footer>
				<div className="footer-content" ref="lastupdated">
					<div className="last-updated">
						<strong>Last updated: </strong>
						{(this.state.loading) ? "Updating..." : DateHelper.getFooterDate(this.state.lastUpdated)}
					</div>
					<div className="add-compare">
						<input type="text" ref="input" onKeyDown={this.onKeyDown} placeholder="Insert your zipcode here..." />
						{ !this.state.loadingZipcode ? 
							<a className="search" ref="searchbtn" onClick={this.performZipSearch}>
								<img src="public/images/search-icon.svg"/>
							</a>
						:
							null
						}
					</div>
					<a className="reload" ref="reloadbtn" onClick={this.requestUpdate}><img src="public/images/reload.svg"/>{(this.state.loading) ? "Updating..." : "reload now"}</a>
				</div>
			</footer>
		);
	}

});

module.exports = FooterComponent;