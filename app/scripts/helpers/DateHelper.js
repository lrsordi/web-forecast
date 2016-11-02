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
	},

	getAMPMHour : function(time){
		var date = new Date(time*1000);
		var str = "";
		var hours = date.getHours();
		  var minutes = date.getMinutes();
		  var ampm = hours >= 12 ? 'pm' : 'am';
		  hours = hours % 12;
		  hours = hours ? hours : 12; 
		  var strTime = ("0"+hours).substr(-2) +' ' + ampm;
		return str + " " + strTime;
	},

	getFooterDate : function(date){
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
}



module.exports = DateHelper;
