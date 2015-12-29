window.onload = function(){
	//字体部分
	var textBox = document.getElementById("text-box");
	textBox.className += ' text-in';
	//粽子部分
	var zzBox = document.getElementById('zz-box');
	zzBox.onclick = function(){
		zzBox.className = 'zz-box zz-run'
	}
}