/*简单研究了一下jq的deferred对象,好抽象!*/
function Deferred(){
	this.doneCallbacks = [];
}

Deferred.prototype.done = function(callback){
	this.doneCallbacks.push(callback);
	return this;
}

Deferred.prototype.resolve = function(){
	var dcbs = this.doneCallbacks;
	for (var i = 0, length = dcbs.length; i<length; i++) {
		dcbs[i]();
	}
	return this;
}

//模拟$.when
function when(){
	var hasDone = 0,
	 	count = arguments.length,
	 	dfd = new Deferred();

 	console.log("arguments.length "+count)

	function callback(){
		console.log("*************")
		console.log("已经执行了["+ (++hasDone) +"]个方法");
		//如果已完成的等于参数数目,则全完成了
		if(hasDone == count){
			//改变Deferred对象的执行状态
			dfd.resolve();
		}
	}
	
	for(var i = 0; i < count; i ++ ){
		//函数入队
		arguments[i].done(callback);
	}

	return dfd;
}

// 自定义异步执行的方法
var wait = function(intval){
    var dfd = new Deferred(); //在函数内部，新建一个Deferred对象
    var tasks = function(){
       console.log("耗时[ "+intval/1000+" ]秒的操作执行完毕！");
       dfd.resolve(); // 改变Deferred对象的执行状态
    };
   setTimeout(tasks,intval);
   return dfd; // 返回Deferred对象
};
var test1 = function(){
	var dtd = new Deferred();
	setTimeout(function(){
		console.log(1);
		// dtd.resolve()
	},1000);
	return dtd;
}
var test2 = function(){
	var dtd = new Deferred();
	console.log(2);
	// dtd.resolve()
	return dtd;
}
function callback(){
	console.log("*************")
	console.log("已经执行了["+ (++hasDone) +"]个方法");
}

//错误:每次调用函数创建,都得到新的dfd,要用一个参数接收才行
test2().done(test1());

var ttt = test2();
console.log(ttt);

// when(test1(),test2());

// 调用测试
// when(wait(5000).done(function(){
// 		console.log('调用第一个done');
// 	}),wait(3000).done(function(){
// 		console.log('调用第二个done');
// 	}));
