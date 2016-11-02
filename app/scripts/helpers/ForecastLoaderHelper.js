var Globals = require('../core/Globals');

var ForecastLoaderHelper = {
	NORFOLK_LAT_LNG : "36.8951441,-76.3256273",
	GECODING_KEY : "AIzaSyCX6K1ddl7GLNnRRNHMnG0vvN-CVSNiMAE",
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
	}
}



module.exports = ForecastLoaderHelper;
