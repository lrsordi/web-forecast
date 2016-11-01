var Globals = require('../Globals');

var ForecastLoaderHelper = {
	NORFOLK_LAT_LNG : "36.8951441,-76.3256273",
	SECRET : "b5edc2d8101cdcbf9eaf23df9e2afa7d",

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
	}
}



module.exports = ForecastLoaderHelper;