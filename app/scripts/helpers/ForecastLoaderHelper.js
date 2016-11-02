var Globals = require('../core/Globals');
var StringsHelper = require('./StringsHelper');

var ForecastLoaderHelper = {
	NORFOLK_LAT_LNG : "36.8951441,-76.3256273",
	GOOGLE_GEOCODING_KEY : "AIzaSyB4aGIjEySyPTOeCkF0r-H2h4YqAWgCZ_0",
	SECRET : "e1df1e2cd4cacc56194f2265e4b927f5",

	loadNorfolkData : function(){
		var def = $.Deferred();

		$.get({
			url : "https://api.darksky.net/forecast/"+this.SECRET+"/"+this.NORFOLK_LAT_LNG + "?lang=en&exclude=currently,minutely,alerts,flags",
			jsonp: "callback",
			dataType: "jsonp",
			// Work with the response
		    success: function( response ) {
		    	Globals.NORFOLK_LAST_UPDATED = new Date();
		    	Globals.NORFOLK_LAST_DATA = response;
		    	def.resolve(response);
		        //console.log( response ); // server response
		    },
		    error : function(respose){
		    	def.fail(response);
		    }
		});

		return def;
	},


	loadComparsionData : function(latlng){
		var def = $.Deferred();

		$.get({
			url : "https://api.darksky.net/forecast/"+this.SECRET+"/"+latlng + "?lang=en&exclude=currently,minutely,alerts,flags",
			jsonp: "callback",
			dataType: "jsonp",
			// Work with the response
		    success: function( response ) {
		    	Globals.NORFOLK_LAST_UPDATED = new Date();
		    	Globals.COMPARING_DATA = response;
		    	def.resolve(response);
		        //console.log( response ); // server response
		    },
		    error : function(respose){
		    	def.fail(response);
		    }
		});

		return def;
	},




	getLatLngBasedOnZipCode : function(zipcode){
		var def = $.Deferred();

		if(zipcode.length == 8){
			zipcode = zipcode.substr(0,5) + "-" + zipcode.substr(5,3);
		}

		$.get({
			url : "https://maps.googleapis.com/maps/api/geocode/json?address="+zipcode+"&key="+this.GOOGLE_GEOCODING_KEY,
			dataType: "json",
			// Work with the response
		    success: function( response ) {
		    	def.resolve(response);
		        //console.log( response ); // server response
		    },
		    error : function(response){
		    	def.fail(response);
		    }
		});

		return def;
	},

	getCityNameBasedOnGoogleResponse : function(response){
		var strcity = "";
		var strstate = "";
		var strcountry = "";
		for(var i = 0; i < response.address_components.length; i++){
			var component = response.address_components[i];
			var strmax = component.long_name;
			var strmin = component.short_name;

			var types = component.types;
			for(var q = 0; q < types.length; q++){
				if(types[q] == "administrative_area_level_2"){
					strcity = strmax;
					continue;
				}
				else if(types[q] == "administrative_area_level_1"){
					strstate = strmin;
					continue;
				}else if(types[q] == "country"){
					strcountry = strmin;
					continue;
				}
			}
		}

		var str = strcity + "," + strstate;
		return StringsHelper.encodeString(str);
	},
}



module.exports = ForecastLoaderHelper;
