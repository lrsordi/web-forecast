var Globals = require('../core/Globals');

var DateHelper = {
	ARR_WEEK_DAYS : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	ARR_MONTHS : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

	getDateTitle : function(time){
		var dt = new Date(time*1000);
		
		var str = this.ARR_WEEK_DAYS[dt.getDay()];
		str += ", ";
		str +=  this.ARR_MONTHS[dt.getMonth()] + " ";
		str += dt.getDate() + ", ";
		str += dt.getFullYear();
		return str;
	}
}



module.exports = DateHelper;
