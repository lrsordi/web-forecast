var React = require('react');
var Router = require('react-router').Router;
var browserHistory = require('react-router').browserHistory;
var Route = require('react-router').Route;
var MainTemplate = require('./MainTemplate');
var IntroScreen = require('./screens/IntroScreen');
var ForecastScreen = require('./screens/ForecastScreen');



require('./vendors/preloadjs-0.6.2.min');
require('./vendors/SplitText.min');




var MainApplication = React.createClass({


  render : function(){
    return (
      <Router history={browserHistory}>
        <Route component={MainTemplate}>
          <Route path="/" component={IntroScreen} />
          <Route path="/forecast" component={ForecastScreen} />
        </Route>
      </Router>
    )
  }
});

module.exports = MainApplication;
