window.onload = function(){
	var num = 1;
	var status = 1;
	var btn = $("#btn");
	var cur = $("#current");
	var next = $("#next");
	var now_angle = 0;
	var next_angle = 90;
	// cur.bind('webkitTransitionEnd', function() {
	// 	alert(1);
	// });
	btn.bind('click',function(){
		if (status) {
			now_angle -=270;
			cur.css('-webkit-transform', 'rotateY('+now_angle+'deg)');	
			cur.css('-webkit-transition','-webkit-transform 3s linear');
			next_angle -=90;
			next.css('-webkit-transform', 'rotateY('+next_angle+'deg)');
			next.css('-webkit-transition','-webkit-transform 1s linear');	
			console.log("in 1")
		}else{
			now_angle -=90;
			cur.css('-webkit-transform', 'rotateY('+now_angle+'deg)');
			cur.css('-webkit-transition','-webkit-transform 1s linear');
			next_angle -=270;
			next.css('-webkit-transform', 'rotateY('+next_angle+'deg)');
			next.css('-webkit-transition','-webkit-transform 3s linear');
			console.log("in 2")
		}
		status = !status;
		setTimeout(function(){
			cur.html(num+1);
	  		next.html(num+1);
	  		num++;
		},600);
	  	
	});
}