window.onload = function(){
	var main = document.getElementById('main');
	var mainContent = document.getElementById('mainContent');
	var sideBar = document.getElementById('sideBar');
	// var mask = main.childNodes;
	var getIndex = function(obj){
		return getComputedStyle(obj)['zIndex'];
	}
	console.log("document.documentElement : "+getIndex(document.documentElement)) 	//0
	console.log("body : "+getIndex(document.body))		//auto
	console.log("#main : "+getIndex(main))		//auto
	console.log("mainContent : "+getIndex(mainContent))		//auto
	console.log("sideBar : "+getIndex(sideBar))		//auto
}