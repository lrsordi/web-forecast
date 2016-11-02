var React = require('react');
var ReactDOM = require('react-dom');

var FooterComponent = React.createClass({
	$el : null,

	getInitialState: function() {
		return {
			lastUpdated:this.props.lastUpdated
		};
	},

	componentDidMount: function() {
		this.$el = ReactDOM.findDOMNode(this);

		TweenMax.fromTo(ReactDOM.findDOMNode(this.refs.lastupdated), 1, {opacity : 0, y : 30}, {opacity : 1, y : 0, ease : Quint.easeInOut});
   		TweenMax.fromTo(ReactDOM.findDOMNode(this.refs.reloadbtn), 1, {y:-10, opacity : 0},{y : 0, opacity : 1, ease : Quint.easeInOut});
	},

	formatDate : function(date){
		var str = ("0"+(date.getMonth()+1)).substr(-2) + "/" + ("0"+date.getDate()).substr(-2) + "/" + date.getFullYear();

		var hours = date.getHours();
		  var minutes = date.getMinutes();
		  var ampm = hours >= 12 ? 'pm' : 'am';
		  hours = hours % 12;
		  hours = hours ? hours : 12; // the hour '0' should be '12'
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours + ':' + minutes + ' ' + ampm;
		return str + " " + strTime;
	},

	render: function() {
		return (
			<footer>
				<div className="footer-content" ref="lastupdated">
					<div className="last-updated">
						<strong>Last updated: </strong>
						{this.formatDate(this.state.lastUpdated)}
					</div>
					<a className="reload" ref="reloadbtn"><img src="public/images/reload.svg"/>reload now</a>
				</div>
			</footer>
		);
	}

});

module.exports = FooterComponent;