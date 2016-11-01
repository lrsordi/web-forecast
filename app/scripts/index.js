window.$ = window.jQuery = require('jquery');
var Application = require('./Application');
var ReactDOM = require('react-dom');
var React = require('react');
var Globals = require('./Globals');
require('gsap');


TweenMax.ticker.fps(60);



var Index = function(){
	var queue;
	var preloaderBar;
	var preloaderPercentage;

	initReferences();
	initLoader();



	window.Globals = Globals;

	function initReferences(){
		preloaderBar = $('#preloader-bar');
		preloaderPercentage = preloaderBar.find(".percentage");
	}

	function initLoader(){
		preloaderBar.show();

		TweenMax.set(preloaderPercentage, {scaleX : 0});
		TweenMax.from(preloaderBar, 1, {scaleY : 0, ease : Expo.easeInOut, onComplete:startLoading});
		//queue.load
	}

	function startLoading(){
		Globals.ARR_INTRO_BACKGROUNDS = [];
		queue = new createjs.LoadQueue(true);
		queue.on("fileload", handleFileComplete);
		queue.on("progress", handleQueueProgress);
		queue.on("error", handleFileError);
		queue.on("complete", handleQueueComplete);
		queue.loadFile({src : "https://api.darksky.net/forecast/b5edc2d8101cdcbf9eaf23df9e2afa7d/36.8951441,-76.3256273", type : createjs.AbstractLoader.JSON, id : "norfolkForecast"});
		for(var i = 1; i <= 5; i++){
			queue.loadFile({src : "public/images/intro/bg"+i+".jpg", type:createjs.AbstractLoader.IMAGE, id : "imageintro"+i, index : i});
		}		

		queue.load();
	}

	function endLoading(){
		TweenMax.to(preloaderBar, 0.5, {scaleY : 0, ease : Expo.easeInOut});
		$("#app").show();
		ReactDOM.render((<Application/>), $("#app")[0]);
	}

	function handleQueueComplete(evt){

	}

	function handleFileError(evt){
		alert("Error when trying to load some file.");
	}

	function handleQueueProgress(evt){
		TweenMax.to(preloaderPercentage, 1, {scaleX : evt.progress, ease : Quint.easeOut, onComplete:((evt.progress == 1) ? endLoading : null)});
	}

	function handleFileComplete(evt){
		if(evt.item.id == "norfolkForecast"){
			Globals.NORFOLK_LAST_DATA = evt.result;
			console.log(evt.result);
		}else{
			Globals.ARR_INTRO_BACKGROUNDS[evt.item.index] = evt.result.src;
		}
	} 

	return {
		handleQueueComplete : handleQueueComplete,
		handleFileError : handleFileError,
		handleQueueProgress : handleQueueProgress,
		handleFileComplete : handleFileComplete
	}

}


$(window).on('load', function(evt){
	new Index();
});



//
