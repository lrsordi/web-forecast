var React = require('react');
var PageTransition = require('react-router-page-transition');
var Link = require('react-router').Link;
var HeaderComponent = require('./components/HeaderComponent');
var FooterComponent = require('./components/FooterComponent');
var Globals = require('../../core/Globals');
var ReactDOM = require('react-dom');
var ForecastLoaderHelper = require('../../helpers/ForecastLoaderHelper');
var browserHistory = require('react-router').browserHistory;


var MainTemplate = React.createClass({

  $interval : null,


  getInitialState: function() {
    return {
      lastUpdated : Globals.NORFOLK_LAST_UPDATED,
      norfolkData : Globals.NORFOLK_LAST_DATA,
      loading : false,
      comparing : false,
      comparingData : null
    }
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
    this.interval = null;
  },

  componentDidMount: function() {
    window.MainTemplate = this;

    TweenMax.fromTo(ReactDOM.findDOMNode(this), 1,{opacity:0},{opacity:1});
    this.interval = setInterval(this.reloadData,15000);
  },  

  updateComparingData : function(){
    this.setState({
      comparingData : null
    });

    this.setState({
        norfolkData : Globals.NORFOLK_LAST_DATA,
        lastUpdated : Globals.NORFOLK_LAST_UPDATED,
        loading : false,
        comparingData : Globals.COMPARING_DATA
      })    
  },

  reloadData : function(){
    if(this.state.loading) return;
    this.onRequestUpdate();
  },

  onRequestUpdate : function(){
    if(this.state.loading) return;

    this.setState({
      loading:true
    });

    var self = this;

    if(self.props.params.comparingCityName && self.props.params.comparingLatLng){
      ForecastLoaderHelper.loadNorfolkData().then(function(evt){
        self.updateComparingData();
      }).fail(function(){
        alert("An error ocurred. Try again.");
      });

    }else{
      ForecastLoaderHelper.loadNorfolkData().then(function(evt){
        self.setState({
          norfolkData : Globals.NORFOLK_LAST_DATA,
          lastUpdated : Globals.NORFOLK_LAST_UPDATED,
          loading : false,
          comparingData : null
        })
      }).fail(function(){
        alert("An error ocurred. Try again.");
      });
    }
  },

  updateComparingData : function(){
    var self = this;
    ForecastLoaderHelper.loadComparsionData(this.props.params.comparingLatLng).then(function(evt){
      self.setState({
          norfolkData : Globals.NORFOLK_LAST_DATA,
          lastUpdated : Globals.NORFOLK_LAST_UPDATED,
          loading : false,
          comparingData : Globals.COMPARING_DATA
        })
    }).fail(function(){
      alert("An error ocurred. Try again.");
    });
  },

  render : function(){
    return (
      <div id="forecast-wrapper">
        <HeaderComponent />
        <section id="forecast-screen" ref='forecast-screen'>
          {React.cloneElement(this.props.children, {norfolkData: this.state.norfolkData, comparingData : this.state.comparingData})}
        </section>
        <FooterComponent lastUpdated={this.state.lastUpdated} loading={this.state.loading} onRequestUpdate={this.onRequestUpdate}/>
      </div>
    )
  }
});

module.exports = MainTemplate;
