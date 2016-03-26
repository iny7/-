/**
 * Created by iny on 2015/11/8.
 */
var screenWidth = window.screen.availWidth;
var containerWidth = screenWidth*0.92;
var gridWidth = screenWidth*0.18;
var gridPadding = screenWidth*0.04;
function getPosTop(i,j){
    return gridPadding+(gridWidth+gridPadding)*i;
}

function getPosLeft(i,j){
    return gridPadding+(gridWidth+gridPadding)*j;
}

function getBgColor(number){
    switch(number){
        case(2):
            return "#eee4da";
            break;
        case(4):
            return "#ede0c8";
            break;
        case(8):
            return "#f2b179";
            break;
        case(16):
            return "#f59563";
            break;
        case(32):
            return "#f67c5f";
            break;
        case(64):
            return "#f65e3b";
            break;
        case(128):
            return "#edcf72";
            break;
        case(256):
            return "#edcc61";
            break;
        case(512):
            return "#9c0";
            break;
        case(1024):
            return "#33b5e5";
            break;
        case(2048):
            return "#09c";
            break;
        case(4096):
            return "#a6c";
            break;
        case(8192):
            return "#93c";
            break;

    }
}

function getColor(number){
    if(number <= 4){
        return "#776a65";
    }
    return "white";
}

function hasSpace(arr){

    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 0 ; j < 4 ; j ++){
            if(arr[i][j] == 0){
                return true;
            }
        }
    }
    return false;
}
//判断当前棋盘能否向左移动
function canMoveLeft(arr){
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 1 ; j < 4 ; j ++ ){
            if( arr[i][j] != 0 ){
                if( arr[i][j-1] == 0 || arr[i][j-1] == arr[i][j]) return true;
            }
        }
    }
    return false;
}
//判断当前棋盘能否向右移动
function canMoveRight(arr){
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 0 ; j < 3 ; j ++ ){
            if( arr[i][j] != 0 ){
                if( arr[i][j+1] == 0 || arr[i][j+1] == arr[i][j]) return true;
            }
        }
    }
    return false;
}
//判断当前棋盘能否向上移动
function canMoveUp(arr){
    for( var j = 0 ; j < 4 ; j ++ ){
        for( var i = 1 ; i < 4 ; i ++ ){
            if( arr[i][j] != 0 ){
                if( arr[i-1][j] == 0 || arr[i-1][j] == arr[i][j]) return true;
            }
        }
    }
    return false;
}

//判断当前棋盘能否向下移动
function canMoveDown(arr){
    for( var j = 0 ; j < 4 ; j ++ ){
        for( var i = 0 ; i < 3 ; i ++ ){
            if( arr[i][j] != 0 ){
                if( arr[i+1][j] == 0 || arr[i+1][j] == arr[i][j]) return true;
            }
        }
    }
    return false;
}
//判断水平方向上的两数字board[i][k]和board[i][j]之间有无数字(k<j)
function noBlockHorizontal( i , k , j , arr){
    for( var a = k+1 ; a < j ; a ++ ){
        if( arr[i][a] != 0) return false;
    }
    return true;
}
//判断垂直方向上的两数字board[k][j]和board[i][j]之间有无数字(k<i)
function noBlockVertical( k , i , j , arr){
    for( var a = k+1 ; a < i ; a ++ ){
        if( arr[a][j] != 0) return false;
    }
    return true;
}