/**
 * Created by iny on 2015/11/8.
 */
function showNumberAnimation(i, j , number) {
    var numberCell = $("#number-cell-" + i + "-"+ j );
    numberCell.css("background-color",getBgColor(number));
    numberCell.css("color",getColor(number ));
    numberCell.text(number);

    numberCell.animate({
        width:gridWidth,
        height:gridWidth,
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    },50);
}

function showMoveAnimation(fromx ,fromy ,tox, toy){
    var numberCell = $("#number-cell-" + fromx + "-"+ fromy );
    numberCell.animate({
        top:getPosTop(tox, toy),
        left:getPosLeft(tox, toy)
    },200);

}
