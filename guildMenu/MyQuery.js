/**
 * Created by iny on 2015/11/18.
 */
function myReady(fn){

    //�ִ��������DomContentLoadedʱ��Ĵ�����ñ�׼��ʱ��󶨷�ʽ
    if(document.addEventListener){
        document.addEventListener("DOMContentLoaded",fn,false);
    }else{
        IEContentLoaded(fn);
    }

    //IEģ��DOMContentLoaded
    function IEContentLoaded(fn){

        //����document����
        var doc = window.document;

        //��֤init()�еĻص�����ִֻ��һ��
        var hasInit = false;

        //ִֻ��һ���û��Ļص�����init()
        var init = function(){
            if(!hasInit){
                hasInit = true;
                fn();
            }
        };

        //�����ţ���ֵ�Hack����
        (function(){
            try {
                doc.documentElement.doScroll('left');
            } catch (e){
                setTimeout(arguments.callee,50);
                return;
            }
            init();
        })();

        //����document�ļ���״̬
        doc.onreadystatechange = function(){
            //����û�����domReady֮��ִ�еĺ�����������ִ��
            if(doc.readyState == 'complete'){
                doc.onreadystatechange = null;
                init();
            }
        };
    }
}