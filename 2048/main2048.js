/**
 * Created by iny on 2015/11/8.
 */
var board;
var score = 0;

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

document.addEventListener('touchstart',function(event){
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    var deltaX = endX - startX ;
    var deltaY = endY - startY ;

    //x
    if(Math.abs(deltaX) >= Math.abs(deltaY) ){
        if(deltaX >= 0 ){
            //right
            if(moveRight()){
                generateOneNumber();
                isGameOver();
            }
        }else{
            //left
            if(moveLeft()){
                generateOneNumber();
                isGameOver();
            }
        }

    }else{//y
        if(deltaY >= 0 ){
            //down
            if(moveDown()){
                generateOneNumber();
                isGameOver();
            }
        }else{
            //up
            if(moveUp()){
                generateOneNumber();
                isGameOver();
            }
        }

    }
});

$(document).ready(function(){
    prepareForMobile();
    newGame();
});

function prepareForMobile(){
    //alert(window.screen.availWidth);
    //alert(window.screen.availWidth);
    //if(screenWidth>500){
    //    containerWidth = 500;
    //    gridWidth = 100;
    //    gridPadding = 20;
    //}

    $("#grid-container").css("width",containerWidth-2*gridPadding);
    $("#grid-container").css("height",containerWidth-2*gridPadding);
    $("#grid-container").css("padding",gridPadding);
    $("#grid-container").css("border-radius",0.02*containerWidth);

    $(".grid-cell").css("width",gridWidth);
    $(".grid-cell").css("height",gridWidth);
    $(".grid-cell").css("border-radius",0.06*gridWidth);
}

function  newGame(){
    //1.³õÊ¼»¯ÆåÅÌ¸ñ
    init();
    //2.ÔÚËæ»úÁ½¸ö¸ñ×ÓÉú³ÉÊý×Ö
    generateOneNumber();
    generateOneNumber();
}

//³õÊ¼»¯ÆåÅÌ¸ñ
function init(){
    board = new Array();
    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 0 ; j < 4 ; j ++){
            var cell = $("#grid-cell-"+i+"-"+j);
            cell.css("top",getPosTop( i , j ));
            cell.css("left",getPosLeft( i , j ));
        }
    }

    for( var i = 0 ; i < 4 ; i ++){
        board[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++){
            board[i][j] = 0;
        }
    }
    updateBoardView();
}

//¸ù¾ÝBoardÊý×é¸üÐÂÆåÅÌ¸ñ
function updateBoardView() {
    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 0 ; j < 4 ; j ++){
            $("#grid-container").append("<div id=number-cell-"+i+"-"+j+" class=number-cell"+"></div>");
            var theNumberCell = $("#number-cell-"+i+"-"+j);

            if(board[i][j] == 0){
                theNumberCell.css("width",0);
                theNumberCell.css("height",0);
                theNumberCell.css("top",getPosTop(i,j)+gridWidth/2);
                theNumberCell.css("left",getPosLeft(i,j)+gridWidth/2);
            }else{
                theNumberCell.css("width",gridWidth);
                theNumberCell.css("height",gridWidth);
                theNumberCell.css("top",getPosTop(i,j));
                theNumberCell.css("left",getPosLeft(i,j));
                theNumberCell.css("background-color",getBgColor(board[i][j]));
                theNumberCell.css("color",getColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
    }
    $(".number-cell").css("font-size",gridWidth*0.6+"px");
    $(".number-cell").css("line-height",gridWidth+"px");
    $(".number-cell").css("border-radius",gridWidth*0.06);
}

//ÔÚ¿Õ°×¸ñËæ»úÉú³ÉÒ»¸öÊý×é2»ò4
function generateOneNumber(){
    if(!hasSpace(board))
        return false;
    while(true){
        var ranX = parseInt(Math.floor(Math.random()*4));
        var ranY = parseInt(Math.floor(Math.random()*4));
        if(board[ranX][ranY] == 0) {
            if(Math.random()>0.5){
                board[ranX][ranY]=2;
            }else{
                board[ranX][ranY]=4;
            }
            break;
        }
    }
    showNumberAnimation(ranX,ranY,board[ranX][ranY]);
    //updateBoardView();
    return true;
}

$(document).keydown(function(event){

    switch (event.keyCode){
        case 37: //left
            if(moveLeft()){
                generateOneNumber();
                isGameOver();
            }
            break;
        case 38://up
            if(moveUp()){
                generateOneNumber();
                isGameOver();
            }
            break;
        case 39://right
            if(moveRight()){
                generateOneNumber();
                isGameOver();
            }
            break;
        case 40://down
            if(moveDown()){
                generateOneNumber();
                isGameOver();
            }
            break;
        default :
            break;
    }
});
//Ïò×óÒÆ¶¯º¯Êý
function moveLeft(){
    if(!canMoveLeft(board)) return false;
    for( var i = 0 ; i < 4 ; i ++ ) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == 0 && noBlockHorizontal( i, k, j, board)){
                        showMoveAnimation(i , j , i ,k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    if( board[i][k] == board[i][j] && noBlockHorizontal( i, k, j, board)){
                        showMoveAnimation(i , j , i ,k );
                        board[i][k] = 2*board[i][j];
                        board[i][j] = 0;
                        //continue;
                    }
                }

            }
        }
    }
    //updateBoardView();
    setTimeout("updateBoardView()",200);
    return true;
}
//ÏòÓÒÒÆ¶¯º¯Êý(Ã÷Ìì»»Ò»ÏÂ±éÀú·½Ïò ÏÖÔÚµÄÓÒÒÆÌ«õ¿½ÅÁË£¡)
function moveRight(){
    if(!canMoveRight(board)) return false;
    for( var i = 0 ; i < 4 ; i ++ ) {
        for ( var j = 2; j >= 0 ; j--) {
            if ( board[i][j] != 0) {
                for( var k = 3  ; k > j  ; k -- ){
                    if( board[i][k] == 0 && noBlockHorizontal( i, j, k, board)){
                        showMoveAnimation(i , j , i ,k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    if( board[i][k] == board[i][j] && noBlockHorizontal( i, j, k, board)){
                        showMoveAnimation(i , j , i ,k );
                        board[i][k] = 2*board[i][j];
                        board[i][j] = 0;
                        //continue;
                    }
                }

            }
        }
    }
    //updateBoardView();
    setTimeout("updateBoardView()",200);
    return true;
}
//ÏòÉÏÒÆ¶¯º¯Êý
function moveUp(){
    if(!canMoveUp(board)) return false;
    for( var j = 0 ; j < 4 ; j ++ ) {
        for (var i = 1; i < 4; i ++) {
            if (board[i][j] != 0) {
                for( var k = 0 ; k < i ; k ++ ){
                    if( board[k][j] == 0 && noBlockVertical( k, i, j, board)){
                        showMoveAnimation(i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    if( board[k][j] == board[i][j] && noBlockVertical( k, i, j, board)){
                        showMoveAnimation(i , j , k , j );
                        board[k][j] = 2*board[i][j];
                        board[i][j] = 0;
                        //continue;
                    }
                }

            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
//ÏòÏÂÒÆ¶¯º¯Êý
function moveDown(){
    if(!canMoveDown(board)) return false;
    for( var j = 0 ; j < 4 ; j ++ ) {
        for ( var i = 2; i >= 0 ; i -- ) {
            if (board[i][j] != 0) {
                for( var k = 3 ; k > i ; k -- ){
                    if( board[k][j] == 0 && noBlockVertical( i, k, j, board)){
                        showMoveAnimation(i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    if( board[k][j] == board[i][j] && noBlockVertical( i, k, j, board)){
                        showMoveAnimation(i , j , k , j );
                        board[k][j] = 2*board[i][j];
                        board[i][j] = 0;
                        //continue;
                    }
                }

            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
//ÅÐ¶ÏÓÎÏ·ÊÇ·ñ½áÊø
//if(!hasSpace(board)&&!canMoveLeft())return false;
function isGameOver(){
    //²»ÏëÐ´ÁË
}