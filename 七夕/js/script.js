var bgSpeed = 20; //背景移动所用时间 单位秒
window.onload = function(){
	// var width = document.documentElement.offsetWidth;
	// var height = document.documentElement.offsetHeight;
	// console.log(width+'+'+height);
	// alert(document.body.height)

	var wrap = document.getElementById('wrap');
	
	var container = wrap.getElementsByClassName('container')[0];


	// 滚动背景
	swipe(container);

	// 男孩走路
	walk(boy);
	// boy.addEventListener("",function(){
		// alert(1)
	// });
}
//男孩
// function getBoy(){
// 	var boy = document.getElementById('boy');
// 	boy.id = 1;
// 	return boy;
// }

// 男孩走路
function walk(boy,where){
	var where = '500%';
	boy.style.transform = "translate("+where+")";
}

// 参数:需要进行滚动的dom元素
function swipe(container){
	var children = container.getElementsByTagName('li');
	var count = children.length;
	//注意值为字符串 如果不加 js会以为translate()是个函数
	container.style.transition =  "all "+bgSpeed+"s linear";
	container.style.transform = 'translate(-'+(count-1)+'00%)';
}
