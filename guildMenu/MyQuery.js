/**
 * Created by iny on 2015/11/18.
 */
function myReady(fn){

    //现代浏览器对DomContentLoaded时间的处理采用标准的时间绑定方式
    if(document.addEventListener){
        document.addEventListener("DOMContentLoaded",fn,false);
    }else{
        IEContentLoaded(fn);
    }

    //IE模拟DOMContentLoaded
    function IEContentLoaded(fn){

        //缓存document对象
        var doc = window.document;

        //保证init()中的回调函数只执行一次
        var hasInit = false;

        //只执行一次用户的回调函数init()
        var init = function(){
            if(!hasInit){
                hasInit = true;
                fn();
            }
        };

        //国外大牛发现的Hack方法
        (function(){
            try {
                doc.documentElement.doScroll('left');
            } catch (e){
                setTimeout(arguments.callee,50);
                return;
            }
            init();
        })();

        //监听document的加载状态
        doc.onreadystatechange = function(){
            //如果用户是在domReady之后执行的函数，就立马执行
            if(doc.readyState == 'complete'){
                doc.onreadystatechange = null;
                init();
            }
        };
    }
}