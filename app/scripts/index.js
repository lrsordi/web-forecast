window.$ = window.jQuery = require('jquery');
var Application = require('./Application');
var ReactDOM = require('react-dom');
var React = require('react');
var Globals = require('./Globals');
var ForecastLoaderHelper = require('./helpers/ForecastLoaderHelper');
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

	function loadForecastData(){
		ForecastLoaderHelper.loadNorfolkData().then(function(evt){
			setQueuePercentage(1);
		});
	}

	function setQueuePercentage(p){
		TweenMax.to(preloaderPercentage, 1, {scaleX : p, ease : Quint.easeOut, onComplete:((p == 1) ? endLoading : null)});
	}

	/**
	* EVENTS
	**/
	function handleForecastLoaded(evt){

	}

	function handleQueueComplete(evt){
		loadForecastData();
	}

	function handleFileError(evt){
		alert("Error when trying to load some file.");
	}

	function handleQueueProgress(evt){
		setQueuePercentage(evt.progress * 0.8);
		
	}

	function handleFileComplete(evt){
		Globals.ARR_INTRO_BACKGROUNDS[evt.item.index] = evt.result.src;
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
