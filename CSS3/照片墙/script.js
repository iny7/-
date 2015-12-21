window.onload = function(){
	var box = document.getElementById('wrap');
	var pics = box.getElementsByTagName('img');
	var location = getLocation(box.offsetWidth,box.offsetHeight-250,5,2);
	
	//通过!important来使hover生效以后 就不用进行事件绑定了
	// for (var i = 0; i < pics.length; i++) {
		// pics[i].onmouseover = function(){
		// 	this.style.transform = 'rotate(0deg)';
		// }
		// pics[i].onmouseout = function(){
		// 	this.style.transform = 'rotate('+(Math.random()*45)+'deg)';	
		// }
	// };
	changeLocation(pics,location);
	
	//这里发现取到的属性和页面中呈现的不一样(即取不到CSS样式表
		//中的属性,会不会是因为样式表中是给img的属性 而不是每个具体的对象呢?)
	console.log(pics[0].style);
	console.log(pics[0].style.transform);
	console.log(pics[0].style['transform']);

	//果不其然,obj.style只能获取内联样式 而下面这个函数才能获得当前显示的样式,
	//可惜得到的transform是一个matrix矩阵 十分不易读
	
	//因为内联样式的权重大于外部引用的css文件 所以css文件中伪类hover的样式
	//因为权重低于设置好的而无法实现 那怎么办呢?查阅资料后 发现还有一个比内联
	//优先级还高的(在相应css的分号前加上!important)
		var style = getComputedStyle(pics[0]);
	console.log(style.transform)

}


//让图片数组根据坐标数组随机排列
function changeLocation(arr_img,arr_loc){
	//技巧,快速打乱数组
	//sort 是对数组进行排序
	//它是这样工作的。每次从数组里面挑选两个数 进行运算。
	//如果传入的参数是0 两个数位置不变。
	//如果参数小于0 就交换位置
	//如果参数大于0就不交换位置
	//接下来用刚才的较大数字跟下一个进行比较。这样循环进行排序。
	arr_loc.sort(function(){return Math.random()-0.5;});
	for (var i = 0; i < arr_img.length; i++) {
		// console.log(arr_loc[i][0],arr_loc[i][1]);
		arr_img[i].style.left = arr_loc[i][0]+'px';
		arr_img[i].style.top = 50+arr_loc[i][1]+'px';

		// var reg = /(rotate\([\-\+]?((\d+)(deg))\))/i;
	    // var wt = arr_img[i].style['transform'], wts = wt.match (reg);
	    //使用正则解析也是然并卵,因为这个style根本就是内联样式表,与css无关
		// console.log(arr_img[i].style['-webkit-transform']);
		arr_img[i].style.transform = 'rotate('+(Math.random()*45)+'deg)';
		
	};
}
//在width*height的区域中获取均匀且随机的x*y个坐标
function getLocation(width,height,x,y){
	var arr = [];
	for(var i = 0; i < x ; i ++){
		for(var j = 0; j < y ; j++){
			locateX = i*width/(x-1) + (Math.random()>0.5?Math.random()*20:0);
			locateY = j*height/(y-1) + (Math.random()>0.5?Math.random()*20:0);
			arr.push([locateX,locateY]);
			// console.log(locateX,locateY)
		}
	}
	return arr;
	
}