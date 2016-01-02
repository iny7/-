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

	/*	动画流程分析:
		走路到页面的2/3的时候，主题页面开始滑动
		走路到1/2的时候，到了商店门口
		进出商店
		走路到1/4到了桥边
		走路到1/2到了桥上	*/
	
	/*实现动画的链式调用（而不是不断调时间）有几种方法
	1.jq的defferd对象
	2.jq的animate函数
	3.用js写一个事件队列（粽子课程里有）
	4.监听transitionend等定义好的事件
	5.用js写实现观察者模式*/

	//这里暂且使用方法4实现,后面再有 尝试用3和5
	/*使用后发现事件监听有一定的局限性,因为事件只能触发一次
	而绑定好的事件将重复触发*/
	//transitionend这个事件很有用

	var walk1 = function(){
		console.log("walk1");
		boy.walk(3,0.6);
		boy.addEventListener("transitionend",roll1);
	}
	var roll1 = function(){
		console.log("roll1");
		
		boy.removeEventListener("transitionend",roll1);
		container.addEventListener("transitionend",inShop);
		
		/*注意这里男孩走一定要比背景滚动先完成,否则,先完成的画面滚动
		会触发shop时间,然后为男孩添加事件监听,这样男孩就会多次walk2
		*/
		boy.walk(2,0.5);
		roll(container,2,3);
	}
	var inShop = function(){
		/*	这里进出门共有4段动画,打印四次就很烦,
		所以把进出门分成两个函数
		结果发现每个函数里还有两段动画,不好监听*/
		console.log("in shop");
		container.removeEventListener("transitionend",inShop);
		boy.addEventListener("transitionend",outShop);

		boy.enterShop();
	}
	var outShop = function(){
		console.log("out shop");

		boy.removeEventListener("transitionend",outShop);
		boy.addEventListener("transitionend",roll2);

		boy.exitShop();
	}
	var roll2 = function(){
		
		console.log("roll2")

		boy.removeEventListener("transitionend",roll2);
		container.addEventListener("transitionend",walk2);

		// 和roll1里面的多行注释同理,这里应该先让背景动
		boy.walk(2,0.15);
		roll(container,3,2);
	
	}
	var walk2 = function(){
		console.log("walk2");

		container.removeEventListener("transitionend",walk2);
	}
	walk1();
	// boy.addEventListener("transitionend",function(){
	// 	// 滚动背景
	// 	roll(container,2,3);
	// 	//完成前面的动作后,男孩用10秒走到页面的70%
	// boy.walk(3,0.5);
	// });

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
	
	// 男孩进商店
	boy.enterShop = function(){
		var style = boy.style.transform;
		boy.style.transition = "all "+2+"s linear";
		boy.style.transform = style+"scale(0.4)";
		boy.style.opacity = 0;
		
		return boy;
	}
	// 男孩出商店
	boy.exitShop = function(){
		var style = boy.style.transform;
		boy.className = "boy withFlower";
		boy.style.transform = style+"scale(1)";
		boy.style.opacity = 1;

		return boy;
	}
		
	return boy;
}

//页面滚动
//Param(需要滚动的对象, 滚动的屏幕数, 滚动所用时间)
function roll(obj, num, time){
	var children = obj.getElementsByTagName('li');
	// var count = children.length;
	//注意值为字符串 如果不加 js会以为translate()是个函数
	obj.style.transition =  "all "+time+"s linear";
	obj.style.transform = 'translate(-'+(num-1)+'00%)';
}
