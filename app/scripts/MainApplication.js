var React = require('react');
var Router = require('react-router').Router;
var browserHistory = require('react-router').browserHistory;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;

var IntroScreen = require('./screens/IntroScreen');
var MainTemplate = require('./screens/forecast/MainTemplate');
var ForecastScreen = require('./screens/forecast/ForecastScreen');



require('./vendors/preloadjs-0.6.2.min');
require('./vendors/SplitText.min');




var MainApplication = React.createClass({


  render : function(){
    return (
      <Router history={browserHistory}>
          <Route path="/" component={IntroScreen} />
          <Route path="/forecast" component={MainTemplate}>
            <IndexRoute component={ForecastScreen} />
          </Route>
      </Router>
    )
  }
});

module.exports = MainApplication;
