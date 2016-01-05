//疑问?jq的deferred对象是如何判断动画完成的呢??
//有时间去读下源码

//可视区域的尺寸
var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;

//暂时看来和上面那个没差
// var WINDOW_HEIGHT = window.innerHeight;

window.onload = function(){
	// var width = document.documentElement.offsetWidth;
	// console.log(WIDTH+'+'+HEIGHT);
	// console.log(window.innerHeight)
	
	//获取背景
	var container = document.getElementById('container');
	//获取男孩
	var boy = getBoy();
	//获取门
	var door = document.getElementById('door');	
	window.onresize = function(){
		console.log("resize")
		WIDTH = document.documentElement.clientWidth;
		HEIGHT = document.documentElement.clientHeight;

		/*boy.height = parseInt(getComputedStyle(boy).height);
		console.log(boy.height)*/

		// console.log("boy.stylee : "+boy.stylee())
	}
	/*	动画流程分析:
		走路到页面的2/3的时候，主题页面开始滑动
		走路到1/2的时候，到了商店门口
		进出商店
		走路到1/4到了桥边
		走路到1/2到了桥上	*/
	
	//现在要使用自定义的时间轴对象来完成动画了
	var timeline = new TimeLine();
	/*第一个动画需要设置延迟时间,但不是放在参数里,
	也就是说start的开始不需要等3秒*/

	/*能不能使用call和arguments来直接调用boy的方法
	而不用封装成另外的函数呢?目前可以调用第一个参数,
	见timeline第48行*/
	/*多个参数的调用会降低函数的复用性,比如这里roll1和
	roll2内部都使用了roll方法,但是roll的参数不同*/
	
	// var ff = boy.walk()
	// timeline.add(ff,1000);
	// timeline.add(ff,1000);

	timeline.add(walk1, 1000);
	timeline.add(roll1, 2000);
	timeline.add(shop, 1000);
	timeline.add(roll2, 1000);
	

	timeline.start();
	
	
	/*通过规范函数的参数顺序(第一个必须为时间)来调用*/
	function walk1(time){
		// console.log("********walk1********");
		boy.walk(time/1000,0.6);
	}
	function roll1(time){
		// console.log("********roll1********");
		boy.walk(time/1000,0.52);
		roll(container,time/1000,2);
	}
	function shop(time){
		console.log("********shop********");
		//开灯
		/*为啥开灯会卡呢???是因为换背景内存开销较大
		所以不要让换背景和滚动背景同时进行(增加0.2s延迟)*/
		openLight(container,time/1000)
		openDoor(door,time/1000)
		boy.shop(time/1000);
	}
	function roll2(time){
		console.log("********roll2********")
		boy.walk(time/1000,0.2);
		roll(container,time/1000,3);
	}
	
}

//获取男孩(面向对象)
function getBoy(){
	var boy = document.getElementById('boy');	

	//男孩样式自适应
	//第一版本:用js实现
	//突发奇想,能不能动态地改变雪碧图的整体background-size呢?
	//尝试了一下,是可以的,哈哈,繁琐的js代码,拜拜吧您!(js动态计算男孩宽高在上个版本)
	
	
	//错误示范: 这样定义属性是没有意义的,因为只是值传递而不是引用传递,所以要用函数动态获取
	//boy.stylee = boy.style.transform;	
	
	//stylee里的getLeft为boy增加了这个属性,其实这一行有没有无所谓,加在这里便于以后查看
	boy.left = 0;
	
	//boy元素的初始高度(291)
	boy.height = parseInt(getComputedStyle(boy).height);
	
	//正确:用函数(对象)制作一个工具类
	//该函数用于获取男孩运动需要的一些样式(left transform等)
	boy.stylee = function(){
		//当前left
		var a = 0;
		var style = function(){
			return boy.style.transform;
		}

		style.getWidth = function(){
			return parseInt(getComputedStyle(boy).width);
		}
		
		style.test = function(){
			console.log(a++)
		}
		style.getLeft = function(){
			if(!boy.left){
				return parseInt(getComputedStyle(boy)['left'])/WIDTH;
			}
			return boy.left;
		}
		style.setLeft = function(num){
			// console.log(a++)
			boy.left = num;
		}
		return style;
	}

	// 男孩走路(把根据像素优化为根据百分比)
	// Param(走路所花时间(秒)，走路到地图的哪个位置(0-1))
	boy.walk = function(time, toWhere){

		// var a = 10; //和闭包函数的变量名相同,值不同,用来测试闭包是否成功

		/*这里为啥要用这样一个工具类呢?
			第一 封装,不用每次都一大串parseInt、computed啥的
			第二 没想好,过后再写,现在太激动了,先用util把其他功能实现了再来总结*/
		var util = this.stylee();

		//从哪儿来?(0-1)
		var fromWhere = util.getLeft()

		//男孩宽度(px)
		var boyWidth = util.getWidth()
		
		//走多远?(是男孩宽度的百分之几?)
		var distance = (toWhere-fromWhere)/(boyWidth/WIDTH)*100;

		//别忘了把男孩的位置更新成最新的
		util.setLeft(toWhere)

		//动画
		boy.style.transition = "transform "+time+"s linear";
		boy.style.transform = util()+"translate("+distance+"%)";
		
		return this;

		// transform的值如果设定的不合规范是会被忽略的
		// boy.style.transform = "abc" //这样并不会改变transfrom的值

		/* 

		//把工具类里面的left用百分比表示如何?事实证明 完美!
		//用地图的宽度乘百分比得到目标位置
		var toLeft = where*WIDTH;
		console.log("toLeft : "+toLeft)
		
		var currentLeft = boystylee.getLeft();
		//发现使用百分比的translate不会改变left值,导致多次走路时候很不准确,但是使用像素又不好自适应

		//解决这个问题的办法是把left保存在一个作用域为boy的变量里,每次运动前从这个变量里取left,
		//运动后更新这个变量,上面非注释的部分使用的就是这个方法

		// console.log(boy.style.left)
		console.log("currentLeft : "+currentLeft)

		//取男孩当前的宽度
		var boyWidth = parseInt(getComputedStyle(boy)['width']);
		// console.log("boyWidth : " + boyWidth)
		
		//需要移动的比例(目标位置 - 当前位置)/男孩宽度
		var moveProportion = (toLeft - currentLeft)/boyWidth*100;
		console.log("和0.2差值为 : "+(toLeft-currentLeft))
		// console.log("moveProportion : "+ moveProportion)

		//变化
		boystylee.setLeft(toLeft)*/
		
	}
	
	/*改用时间轴后,就不用考虑同时触发的多个监听事件带来的干扰
	了,但是动画不如监听触发来的精准,而且要考虑诸如0.2s这样
	的延时对时间轴带来的干扰(可以在完善时间轴实现延时功能)*/
	//疑问?jq的deferred对象是如何判断动画完成的呢??
	//由于上述原因,重新把进出商店合并成一个函数,更符合逻辑

	// 男孩购物 = 原版(男孩进商店 + 男孩出商店)
	boy.shop = function(time){
		//男孩进店
		boy.style.transition = "all "+time/2+"s linear";
		//我定义的stylee方法返回的是 ((获取取当前transform的方法)的名称),这么写有点绕了,详见代码
		boy.style.transform = boy.stylee()()+"scale(0.4)";
		boy.style.opacity = 0;

		//男孩出店
		setTimeout(function(){
			boy.className = "boy withFlower";
			//因为scale的追加会互相影响,如果不用字符串将原先的剔除的话,就只能用2.5来还原成一倍( 2.5*0.4 = 1)
			boy.style.transform = boy.stylee()()+"scale(2.5)";
			boy.style.opacity = 1;
		},time*1000/2);

		return boy;
	}
	//此函数纯属娱乐
	boy.gun = function(time){
		var style = boy.style.transform;
		boy.style.transition = "all "+time+"s linear";
		boy.style.transform = style+"rotate(-1440deg) ";
	}	
	return boy;
}

//页面滚动
//Param(需要滚动的对象, 滚动的屏幕数, 滚动所用时间)
function roll(obj, time, num){
	//注意值为字符串 如果不加 js会以为translate()是个函数
	obj.style.transition =  "all "+time+"s linear";
	obj.style.transform = 'translate(-'+(num-1)+'00%)';
}
function openDoor(obj, time){
	var children = obj.getElementsByTagName("div");
	children[0].style.webkitAnimation = "leftDoor "+time+"s";
	children[1].style.webkitAnimation = "rightDoor "+time+"s" ;
}
function openLight(obj,time){
	
	/*这里加载图片(背景图,较大)会闪屏,四种解决办法,
		第一 在html中埋隐藏src相同的img
		第二 在html中埋隐藏任意标签(如div) 在css中设置背景图
		第三 js预加载图片并在onload事件中执行(若图片较多
			可以写一个简单的图片加载函数(利用数组的pop))
		第四 css3的animation换背景,不知为啥不会闪,猜想可能是
			因为新背景未加载好的时候旧背景仍然存在,不会因为旧的没了
			而新的还没加载好出现空白期而闪屏
	*/
	
	/*换背景会影响画面的流畅度,如果背景正在滑动会有明显的卡顿,
	 所以要加200毫秒的延迟,优化视觉效果*/
	var bg2 = obj.getElementsByTagName("li")[1];
	
	/*方法一 & 二 : 使用html里预先埋好元素来预加载第二个界面的开灯
	的背景图来实现预加载,*/
	// setTimeout(function(){
	// 	bg2.className = "bright";
	// },200);
	// setTimeout(function(){
	// 	bg2.className = "";
	// },time*1000);

	// 方法三:(不使用html元素,而仅仅用js)图片预加载
	// var bright = new Image();
	// bright.src = "images/QixiB-bright.png";
	// bright.onload = function(){
	// 	setTimeout(function(){
	// 		console.log("jiazaihaole ")
	// 		bg2.className = "bright";
	// 	},100);
	// }
	// setTimeout(function(){
	// 	bg2.className = "";
	// },time*1000);

	//方法四 不用埋html也不用js,animation动画直接换背景
	//如前面所说会有卡顿,给动画增加0.1秒延迟就流畅多了
	bg2.style.webkitAnimation = "light "+time+"s 0.1s";
}
