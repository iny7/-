var WINDOW_WIDTH = 1000;
var WINDOW_HEIGHT = 500;
var MARGIN_LEFT = 50;
var MARGIN_TOP = 50;
var RADIUS = 6;

//11是月份 -1 得到的
// const deadLine = new Date(2015,11,18,3,00,00);
var deadLine = new Date()
deadLine.setTime( deadLine.getTime()+ 3600*1000);
var restTime = deadLine - new Date();
var balls = [];
const colors = ["#33B5E5","#0099CC","#A6C","#93C","#9C0","#690","#FB3","#F80","#F44","#C00"];

window.onload = function(){
	
	WINDOW_WIDTH = document.documentElement.clientWidth;
	WINDOW_HEIGHT = document.documentElement.clientHeight-30;
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/6);
	RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;
	
	ctx.fillStyle = "#900";
	ctx.strokeStyle = "#ccc";
	
	
	setInterval(function(){
		upDate();
		drawTime(restTime,ctx);
		drawBall(ctx);
	},50);
}

function upDate(){
	//取得当前的时间的时分秒
	var currentTime = restTime;
	var currentHours = parseInt(currentTime/1000/3600);
	var currentMins = parseInt(currentTime/1000/60%60);
	var currentSeconds = parseInt(currentTime/1000%60);

	//取得下一个时间的时分秒
	var nextTime = deadLine - new Date();
	var nextHours = parseInt(nextTime/1000/3600);
	var nextMins = parseInt(nextTime/1000/60%60);
	var nextSeconds = parseInt(nextTime/1000%60);

	//如果下一个时间与当前时间的秒数不等,用下一个时间作为当前时间
	if(nextSeconds != currentSeconds){
		restTime = nextTime;
		//对6个位置上的数字分别进行判断
		if (Math.floor(nextHours / 10) != Math.floor(currentHours / 10)) {
			createBall(parseInt(nextHours/10),MARGIN_LEFT,MARGIN_TOP);
		}
		if (nextHours % 10 != currentHours % 10) {
			createBall(parseInt(nextHours%10),MARGIN_LEFT + 15*(RADIUS+2),MARGIN_TOP);
		}
		if (Math.floor(nextMins / 10) != Math.floor(currentMins / 10)) {
			createBall(parseInt(nextMins/10),MARGIN_LEFT + 39*(RADIUS+2),MARGIN_TOP);
		}
		if (nextMins % 10 != currentMins % 10) {
			createBall(parseInt(nextMins%10),MARGIN_LEFT + 54*(RADIUS+2),MARGIN_TOP);
		}
		if (Math.floor(nextSeconds / 10) != Math.floor(currentSeconds / 10)) {
			console.log(5%10);
			createBall(parseInt(nextSeconds/10),MARGIN_LEFT + 78*(RADIUS+2),MARGIN_TOP);
		}
		if (nextSeconds % 10 != currentSeconds % 10) {
			createBall(parseInt(nextSeconds % 10),MARGIN_LEFT + 93*(RADIUS+2),MARGIN_TOP);
		}
	}
	
	updateBall();
}

//创建小球
function createBall(num,startX,startY){
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if(digit[num][i][j] == 1){
				var ball = {
					x:startX+RADIUS*2.4*j,
					y:startY+RADIUS*2.4*i,
					r:RADIUS,
					vx:-8,
					vy:-15,
					a:1+Math.random(),
					color:colors[Math.floor(Math.random()*10)]
				};
				balls.push(ball);
			}
		}
	}
}

//更新彩球位置
function updateBall(){
	for (var i = 0; i < balls.length; i++) {
		balls[i].vy += balls[i].a;
		balls[i].x = balls[i].x + balls[i].vx;
		balls[i].y = balls[i].y + balls[i].vy;
		if(balls[i].y >= WINDOW_HEIGHT - RADIUS){
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = - Math.floor(balls[i].vy * 0.5);
		}
	}
	//用于统计当前屏幕中的小球
	var count = 0;
	for (var i = 0; i < balls.length; i++) {
		//若小球还在画布的区域内,count++
		if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
			balls[count++] = balls[i];
		}
	}
	//当大于300和count的较小值时,数组去尾,从而保证了画面中同时不超过300个小球,性能得以保证
	while(balls.length > Math.min(300,count)){
		balls.pop();
	}
}

//画彩球
function drawBall(ctx){
	// ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
	for (var i = 0; i < balls.length; i++) {
		ctx.fillStyle = balls[i].color;
		ctx.beginPath();
		ctx.arc(balls[i].x, balls[i].y, balls[i].r, 0 , 2*Math.PI);
		ctx.fill();
	}
}

/*Param:
	time:距离截止日期的时间(毫秒数)
	ctx:画笔
 */
function drawTime(time,ctx){
	ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
	if(time < 0 ){
		time = 0;
	}

	var hours = parseInt(time/1000/3600);
	var mins = parseInt(time/1000/60%60);
	var seconds = parseInt(time/1000%60);

	drawDigit(parseInt(hours/10),ctx,MARGIN_LEFT,MARGIN_TOP,RADIUS);
	drawDigit(parseInt(hours%10),ctx,MARGIN_LEFT + 15*(RADIUS+2),MARGIN_TOP,RADIUS);
	drawDigit(10,ctx,MARGIN_LEFT + 30*(RADIUS+2),MARGIN_TOP,RADIUS);
	drawDigit(parseInt(mins/10),ctx,MARGIN_LEFT + 39*(RADIUS+2),MARGIN_TOP,RADIUS);
	drawDigit(parseInt(mins%10),ctx,MARGIN_LEFT + 54*(RADIUS+2),MARGIN_TOP,RADIUS);
	drawDigit(10,ctx,MARGIN_LEFT + 69*(RADIUS+2),MARGIN_TOP,RADIUS);
	drawDigit(parseInt(seconds/10),ctx,MARGIN_LEFT + 78*(RADIUS+2),MARGIN_TOP,RADIUS);
	drawDigit(parseInt(seconds%10),ctx,MARGIN_LEFT + 93*(RADIUS+2),MARGIN_TOP,RADIUS);
}
/*Param:
 	num:需要绘制的数字
 	ctx:画笔
 	startX:绘制的起点X坐标
 	startY:绘制的起点Y坐标
 	radius:点阵中每个点的半径
 */
function drawDigit(num,ctx,startX,startY,radius){
	ctx.fillStyle = "#819922";
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if(digit[num][i][j]){
				ctx.beginPath();
				ctx.arc(startX+radius*2.4*j, startY+radius*2.4*i, radius, 0, 2*Math.PI);
				ctx.fill();
			}
		}
	}
}