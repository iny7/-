var WIDTH = document.documentElement.offsetWidth;
window.onload = function(){
	// var width = document.documentElement.offsetWidth;
	// var height = document.documentElement.offsetHeight;
	// console.log(width+'+'+height);
	// alert(document.body.height)

	//获取背景
	var container = document.getElementById('container');
	//获取男孩
	var boy = getBoy();

	// 滚动背景
	roll(container,10);

	
	
	// 男孩用3秒走到页面50%
	boy.walk(3,0.5);
	
	/*实现动画的链式调用（而不是手调时间）有几种方法
	1.jq的defferd对象
	2.jq的animate函数
	3.用js写一个时间控制器（粽子课程里有）
	4.监听transitionend等定义好的事件
	5.用js写实现观察者模式*/

	//这里暂且使用方法4实现,后面再有 尝试用3和5
	//这个事件监听很有用
	boy.addEventListener("transitionend",function(){
		//完成前面的动作后,男孩用20秒走到页面的70%
		boy.walk(20,0.7);
	});

}
//获取男孩(面向对象)
function getBoy(){
	var boy = document.getElementById('boy');
	
	// 男孩走路
	// Param(运动时间，运动到地图的百分比)
	boy.walk = function(time, where){
		
		//用地图的宽度乘百分比得到目标位置
		var toLeft = where*WIDTH;
		//这里又用到了getComputerdStyle获取当前呈现的所有style
		var currentLeft = getComputedStyle(boy)['left'];
		//需要移动的距离为目标位置减去当前位置，注意当前位置是带'px'的，要进行转换
		// console.log(currentLeft)
		var instance = toLeft - parseInt(currentLeft);
		boy.style.transition = "transform "+time+"s linear";
		boy.style.transform = "translate("+instance+"px)";
		
		return boy;
	}
	return boy;
}

//页面滚动
//Param(需要滚动的对象, 滚动所用时间)
function roll(obj, time){
	var children = obj.getElementsByTagName('li');
	var count = children.length;
	//注意值为字符串 如果不加 js会以为translate()是个函数
	obj.style.transition =  "all "+time+"s linear";
	obj.style.transform = 'translate(-'+(count-1)+'00%)';
}
