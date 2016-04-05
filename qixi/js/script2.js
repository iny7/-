//疑问?jq的deferred对象是如何判断动画完成的呢??
//有时间去读下源码

//可视区域的尺寸
var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;
// var WINDOW_HEIGHT = window.innerHeight;

//窗口大小发生变化时动态改变WIDTH和HEIGHT
window.onresize = function(){
	WIDTH = document.documentElement.clientWidth;
	HEIGHT = document.documentElement.clientHeight;
}

window.onload = function(){
	
	//场景控制对象
	var controller = new Controller();
	var boy = getBoy();
	var girl = getGirl();

	//砸人的星星
	var star6 = document.getElementById('star6');
	
	var timeline = new TimeLine();
	controller.playMusic();
	/*	动画流程分析:
		走路到页面的2/3的时候，主题页面开始滑动
		走路到1/2的时候，到了商店门口
		进出商店
		走路到1/4到了桥边
		走路到1/2到了桥上	*/

	//第一段音乐起  0-8
	timeline.add(walk1, 6000);
	timeline.add(roll1, 7000);
	//第二段音乐起	  8-15
	timeline.add(function(){}, 500);
	timeline.add(shop, 3000);
	//第三段音乐起  16-26
	timeline.add(roll2, 5500);
	timeline.add(goOnBridge,3200)
	timeline.add(turn,700);
	//第三段音乐起  16-26
	timeline.add(duang,1000);
	timeline.add(flower,2000);
	/*可以来个云把他们带走！或者前面跟鸟打个招呼，
	然后鸟最后过来什么的，skew和rotate没怎么用，
	没太多技术含量了，有空玩儿吧*/
	/*既然有星星图，那就可以可以弄个遇见你的时候星星都落到我头上*/
	timeline.start();
	
	
	/*通过规范函数的参数顺序(第一个必须为时间)来调用*/
	function walk1(time){
		boy.walk(time/1000,0.5);
	}
	function roll1(time){
		boy.walk(time/1000,0.52);
		controller.roll(time/1000,2);
		controller.birdFly();
	}
	function shop(time){
		/*因为男孩拿花是用定时器做的,当时间值写的太小的时候可能
		会影响其他动画,详见函数体内部注释*/
		time = time > 0 ? time : 1;
		controller.openLight(time/1000)
		controller.openDoor(time/1000)
		boy.shop(time/1000);
	}
	function roll2(time){
		boy.walk(time/1000,0.12);
		controller.roll(time/1000,3);
	}
	function goOnBridge(time){
 	   boy.walk(time / 1000, 0.4, 0.29)
	}
	function turn(){
		boy.turnBack();
		girl.turnBack();
	}
	function flower(){
		controller.blow();
	}
	function duang(){
		star6.className = "star6 duang";
		girl.fall();
	}
}

//男孩
function getBoy(){
	var boy = document.getElementById('boy');	

	boy.left = 0;
	boy.bottom = 0;
	//boy元素的初始高度(291)
	// boy.height = parseInt(getComputedStyle(boy).height);
	
	//该工具用于提供男孩运动需要的一些样式(left transform等)
	boy.stylee = function(){
		var style = function(){
			return boy.style.transform;
		}
		style.getWidth = function(){
			return parseInt(getComputedStyle(boy).width);
		}
		style.getHeight = function(){
			return parseInt(getComputedStyle(boy).height);	
		}
		style.getLeft = function(){
			if(!boy.left){
				return parseInt(getComputedStyle(boy)['left'])/WIDTH;
			}
			return boy.left;
		}
		style.setLeft = function(num){
			boy.left = num;
		}
		style.getBottom = function(){
			if(!boy.bottom){
				return parseInt(getComputedStyle(boy)['bottom'])/HEIGHT;
			}
			return boy.bottom;	
		}
		style.setBottom = function(num){
			boy.bottom = num;
		}

		return style;
	}

	// 男孩走路(如果只用y，x传undefined)
	boy.walk = function(time, toX, toY){


		var util = this.stylee();
		//为解决性能问题,进行时间监控
		// var t = new Date()
		// console.log("男孩走路的时候 : "+t.getTime())
		//监测调用函数时男孩的transform值
		// console.log(util())
			
		var fromWhere = util.getLeft()
		var boyWidth = util.getWidth()
		
		var distance = (toX-fromWhere)/(boyWidth/WIDTH)*100;
		if (toY!=undefined) {
			boy.walkY(time,toY);
		};
		//别忘了把男孩的位置更新成最新的
		util.setLeft(toX)

		//动画
		boy.style.transition = "transform "+time+"s linear";
		boy.style.transform = util()+"translate("+distance+"%)";
		
		return boy;
		
	}
	// 男孩竖直方向移动
	boy.walkY = function(time, toY){

		//创建实时获取样式用的工具类
		var util = this.stylee();

		//从哪儿来?(0-1)
		var fromWhere = util.getBottom()
		//男孩高度(px)
		var boyHeight = util.getHeight()
		//走多远?(是男孩宽度的百分之几?)
		var distance = -(toY-fromWhere)/(boyHeight/HEIGHT)*100;
		//别忘了把男孩的位置更新成最新的
		util.setBottom(toY)

		boy.style.transition = "transform "+time+"s linear";
		boy.style.transform = util()+"translateY("+distance+"%)";
		
		return boy;
	}
	// 男孩购物 = 男孩进商店 + 男孩出商店
	boy.shop = function(time){
		
		//男孩进店
		boy.style.transition = "all "+time/2+"s linear";
		//我定义的stylee方法返回的是 ((获取取当前transform的方法)的名称),这么写有点绕了,详见代码
		boy.style.transform = boy.style.transform+"scale(0.4)";
		boy.style.opacity = 0;

		//男孩出店
		/*使用定时器
		1.不能设置为负数和0
		2.可能会因为计算机和浏览器的性能带来一些问题,例如:
		在1000ms的时候调用函数,time = 4 这个定时器应该在第1002ms触发,
		timeline中设定的1004ms定时器竟然先触发了(时间间隔太短),而触发时用来恢复男孩大小的scale2.5还没有设定,
		这就导致了男孩后来走位不准,临时解决方案:
		一 男孩walk时候用字符串操作剔除scale
		二 在函数入口处加判断,经过测试,time最小值为10的时候基本会正常调用(即误差5ms)*/
		setTimeout(function(){
			boy.className = "boy withFlower";
			//因为scale的追加会互相影响,如果不用字符串将原先的剔除的话,就只能用2.5来还原成一倍( 2.5*0.4 = 1)
			boy.style.transform = boy.style.transform+"scale(2.5)";
			boy.style.opacity = 1;
			
			//为解决性能问题,进行时间监控
			// var t = new Date()
			// console.log("取完花的时刻 : "+t.getTime())
		},time*1000/2);
		return boy;
	}
	// 男孩送花
	boy.turnBack = function(){
		boy.className = "boy boyBack";
	}
	//此函数纯属娱乐
	boy.gun = function(time){
		var style = boy.style.transform;
		boy.style.transition = "all "+time+"s linear";
		boy.style.transform = style+"rotate(-1440deg) ";
	}	
	return boy;
}

//女孩
function getGirl(){
	var girl = document.getElementById('girl');
	
	girl.turnBack = function(){
		 girl.className = "girl girlBack";
	}

	girl.fall = function(){
		girl.style.transition = "all 1s 2.5s"
		girl.style.transformOrigin = "0% 100%";
		girl.style.transform = "rotateX(70deg)"
	}
	return girl;
}

//场景控制器
function Controller(){
	
	var obj = new Object();
	//获取背景
	obj.container = document.getElementById('container');
	//门
	obj.door = document.getElementById('door');	
	//鸟
	obj.bird = document.getElementById('bird');

	//页面滚动
	obj.roll = function(time, num){
		//注意值为字符串 如果不加 js会以为translate()是个函数
		container.style.transition =  "all "+time+"s linear";
		container.style.transform = 'translate(-'+(num-1)+'00%)';
	}
	//开门
	obj.openDoor = function(time){
		var children = door.getElementsByTagName("div");
		children[0].style.webkitAnimation = "leftDoor "+time+"s";
		children[0].style.mozAnimation = "leftDoor "+time+"s";
		children[0].style.animation = "leftDoor "+time+"s";
		
		children[1].style.webkitAnimation = "rightDoor "+time+"s";
		children[1].style.mozAnimation = "rightDoor "+time+"s";
		children[1].style.animation = "rightDoor "+time+"s";
	}
	//开灯
	obj.openLight = function(time){
		var bg2 = container.getElementsByTagName("li")[1];
		bg2.style.webkitAnimation = "light "+time+"s 0.1s";
		bg2.style.mozAnimation = "light "+time+"s 0.1s";
		bg2.style.animation = "light "+time+"s 0.1s";
	}
	//鸟飞
	obj.birdFly = function(){
		bird.style.transition = "all "+20+"s linear"
		bird.style.transform = "translate(-3000px)";
	}
	//撒花
	obj.blow = function(){
		//用来放花的盒子
		var box = document.getElementById('box');

		var fn = function(){
			var flower = generateFlower();
			box.appendChild(flower)
			//用监听把花弄没
			var listener = function(){
				box.removeChild(flower);
				this.removeEventListener("transitionend",listener)
			}
			flower.addEventListener('transitionend',listener)
			var children = box.childNodes;
			while (children.length>20) {
				box.removeChild(children[0]);
			};
		}

		var timer = setInterval(fn,500)	

		//生成花
		function generateFlower(){
			//脚本是在index.html里引用的,注意地址是基于index的
			var URLS = ["url('images/snowflake/snowflake1.png')",
				"url('images/snowflake/snowflake2.png')",
				"url('images/snowflake/snowflake3.png')",
				"url('images/snowflake/snowflake4.png')",
				"url('images/snowflake/snowflake5.png')",
				"url('images/snowflake/snowflake6.png')"]

			var flower = (function(urls){
				//花(旋转)
				var flower = document.createElement('div')
				flower.className = 'flower'
				var index = Math.floor(Math.random()*6);
				flower.style.backgroundImage = urls[index];
				//装每个花的容器(下落)
				var wraper = document.createElement('div')
				wraper.className = "flowerWraper"
				wraper.style.left = Math.random()*100+"%";
				wraper.appendChild(flower)
				return wraper;
			}(URLS))


			flower.fall = function(){
				/*因为花的旋转是用animation+transform做的,这里就不能
				写transform了,因为会覆盖animation里的transform,	解决
				办法:
				一 用传统的定时器改变left bottom来移动
				二(选用) 为每个花外加个容器,让容器tramsform控制下落,
					花transform负责旋转*/
				var opacity = Math.random();
				flower.style.opacity = opacity > 0.8 ? opacity : 0.8;
				flower.style.transition = "all 10s linear";
				setTimeout(function(){
					//有时候会花会直接出在下面,并且不会消失,这还是定时器时间过短引发的性能问题
					var toX = (Math.random()-0.5)*500;
					flower.style.transform = "translateX("+toX+"%) translateY(2300%)";
					flower.style.opacity = 0.3;
				},50);
			}()

			return flower;
		}
	}
	//音乐
	obj.playMusic = function(){

		var audioConfig = {
			playURL : "happy.wav",
			cycleURL : "circulation.wav"
		}

		function playMusic(url, isloop){
			var audio = new Audio(url);
			audio.autoPlay = true;
			audio.loop = isloop || false;
			audio.play();
			return {
				end:function(callback){
					audio.addEventListener('ended',function(){
						callback();
					},false);
				}
			}
		}

		var music = playMusic(audioConfig.playURL)
		music.end(function(){
			playMusic(audioConfig.cycleURL,true)
		})
	}
	
	return obj;
}




