/*监听那一招不太好用,这次试试用时间轴将所有的
动画按顺序放进队列,写一个工具类 timeline*/

//时间轴对象
function TimeLine(){
	this.time = [];
	this.queue = [];
	return this;
}

//入队
//约定入队函数参数格式为(动画函数,动画时间, 动画描述)
TimeLine.prototype.add = function(fn, time, desc){
	// console.log(desc+" 入队")
	var task = {
		"fn":fn,
		"time": time,
		"desc":desc
	}
	this.queue.push(task);
	return this;
}

//出队
TimeLine.prototype.start = function(point){
	var length = this.queue.length;
	//初始时间为0
	var time = 0;
	point = point > 0 ? point : 0;
	// console.log("point : "+point)
	//这个循环是为了计算每个动画开始前的时间并布置任务
	for(var i = 0 ; i < length ; i ++ ){
		//闭包保护变量i不被污染

		(function(me){
			var _anim = me.queue[i];
			// console.log("Atime : "+_anim["time"])
			//队列中的每个动画的时间将被累加
			time += _anim.time;
			// console.log("time : "+time);
			//每个动画之前的时间被记录在数组内
			me.time[i] = time;
			// console.log(me.time);
			//参数中传具名函数会立即执行,注意
			var waitTime = me.time[i-1];
			// console.log(waitTime||0)
			setTimeout(function(){
					_anim["fn"](_anim["time"]);
				},me.time[i-1]);
		})(this)
	}

	//布置好任务后清空时间轴
	this.queue = [];
	this.time = [];	

	return this;
}

//test
//记得增加延时动画功能
/*
var line = new TimeLine();
var walk = function(time){
	console.log(time);
}
var walk2 = function(){
	console.log("walk2");
}
// function roll(a){}
line.add(walk,2000,"walk");
line.add(walk,1000,"walk");
line.add(walk,1000,"hello");
// line.add(roll);
line.start();
line.add(walk2,5000,"hello");
line.start();
*/