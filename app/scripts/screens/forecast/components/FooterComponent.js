var React = require('react');
var DateHelper = require('../../../helpers/DateHelper');
var ReactDOM = require('react-dom');

var FooterComponent = React.createClass({
	$el : null,

	getInitialState: function() {
		return {
			lastUpdated:this.props.lastUpdated,
			loading : this.props.loading,
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
						<input type="text" ref="input" placeholder="Insert your zipcode here..." /><a className="search" onClick={this.performZipSearch}><img src="public/images/search-icon.svg"/></a>
					</div>
					<a className="reload" ref="reloadbtn" onClick={this.requestUpdate}><img src="public/images/reload.svg"/>{(this.state.loading) ? "Updating..." : "reload now"}</a>
				</div>
			</footer>
		);
	}

});

module.exports = FooterComponent;