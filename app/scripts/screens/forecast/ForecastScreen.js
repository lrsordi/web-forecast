var React = require('react');
var Link = require('react-router').Link;
var ReactDOM = require('react-dom');
var WeatherListComponent = require("./list/WeatherListComponent");
var StringsHelper = require('../../helpers/StringsHelper');
var ForecastLoaderHelper = require('../../helpers/ForecastLoaderHelper');
var Globals = require('../../core/Globals');


var ForecastScreen = React.createClass({
  decryptString : function(str){
    return StringsHelper.toTitleCase(StringsHelper.decodeString(str));
  },

	getInitialState: function() {

		return {
			comparing:(this.props.params.comparingCityName && this.props.params.comparingLatLng),
			norfolkData : this.props.norfolkData,
      comparingData : null,
      loadingComparing : false,
      comparingCityName : (this.props.params.comparingCityName) ? this.decryptString(this.props.params.comparingCityName) : null,
      comparingLatLng : this.props.params.comparingLatLng
		};
	},

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      comparing : ((this.props.params.comparingCityName != null) && (this.props.params.comparingLatLng != null)),
      norfolkData : nextProps.norfolkData,
      comparingData : nextProps.comparingData,
      comparingCityName : (nextProps.params.comparingCityName) ? this.decryptString(nextProps.params.comparingCityName) : null,
      comparingLatLng : nextProps.params.comparingLatLng
    });
  },

  componentDidMount: function() {
    if(this.state.comparingLatLng != null){
      this.loadComparingData();
    }    
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(this.state.comparingLatLng != prevState.comparingLatLng && this.state.comparingLatLng){
      this.loadComparingData();
    }


    if(this.state.loadingComparing == false && this.state.comparingData != prevState.comparingData && this.state.comparingData != null){
      this.refs.norfolkList.alignToIndex(0,true);
    }
  },


  loadComparingData : function(){
    this.setState({
      loadingComparing:true
    });

    var self = this;
    ForecastLoaderHelper.loadComparsionData(this.state.comparingLatLng).then(function(result){
      self.setState({
        comparingData : Globals.COMPARING_DATA,
        comparing : true,
        loadingComparing:false
      });
    }).fail(function(){
      self.setState({
        loadingComparing:false
      });      
      alert("An error ocurred when loading comparsion data. Try again.");
    });
  },

  onChangePos : function(source,pos){
    if(source == this.refs.norfolkList){
      if(this.refs.comparingList){
        this.refs.comparingList.externalPositeElements(pos);
      }
    }else{
      this.refs.norfolkList.externalPositeElements(pos);
    }
  },

  onAlignToIndex : function(source,pos){
    if(source == this.refs.norfolkList){
      if(this.refs.comparingList){
        this.refs.comparingList.alignToIndex(pos,true);
      }
    }else{
      this.refs.norfolkList.alignToIndex(pos,true);
    }
  },  



  render : function(){
    return (
    	<div className="section-container">
      	  <WeatherListComponent data={this.state.norfolkData} title="Norfolk, VA" ref="norfolkList" onChangePos={this.onChangePos} onAlignToIndex={this.onAlignToIndex} delayed={true} retracted={this.state.comparing && (this.state.comparingData != null)} />
        {this.state.comparing && this.state.comparingData ?
          <WeatherListComponent data={this.state.comparingData} title={this.state.comparingCityName} onChangePos={this.onChangePos} onAlignToIndex={this.onAlignToIndex} ref="comparingList" delayed={false} />
        : null
        }

        {this.state.loadingComparing ? 
          <div className='loading-layer'></div>
          : null  
        }
      </div>
    )
  }
});


module.exports = ForecastScreen;
