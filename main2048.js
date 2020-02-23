var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
    prepareForMobile();
    newGame();
});

function prepareForMobile(){
    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }

    $("#grid-container").css("width",gridContainerWidth - 2*cellSpace);
    $("#grid-container").css("height",gridContainerWidth - 2*cellSpace);
    $("#grid-container").css("padding",cellSpace);
    $("#grid-container").css("border-radius",0.02 * gridContainerWidth);

    $(".grid-cell").css("width",cellSideLength);
    $(".grid-cell").css("height",cellSideLength);
    $(".grid-cell").css("border-radius",0.02 * cellSideLength)

}

function newGame(){
    // 初始化棋盘格
    init();
    // 在随机两个格子生成数字
    generateOneNumeber();
    generateOneNumeber();
}

function init(){

    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){

            var gridCell = $("#grid-cell-"+i+"-"+j);
            // 设置每个格子的样式
            gridCell.css("top",getPosTop(i,j));
            gridCell.css("left",getPosLeft(i,j));

        }
    }
    // 生成二维数组
    for(var i = 0; i < 4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0; j < 4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
    
    updateScore(score = 0);

}
// 更新页面
function updateBoardView(){

    $(".number-cell").remove();

    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j +'"></div>');
            var theNumberCell = $("#number-cell-" + i + "-" + j);
            // 设置显示数字的样式
            if(board[i][j] == 0){
                theNumberCell.css("width","0px");
                theNumberCell.css("height","0px");
                theNumberCell.css("top", getPosTop(i,j) + 0.5 * cellSideLength);
                theNumberCell.css("left", getPosLeft(i,j) + 0.5 * cellSideLength);
            } else {
                theNumberCell.css("width",cellSideLength);
                theNumberCell.css("height",cellSideLength);
                theNumberCell.css("top", getPosTop(i,j));
                theNumberCell.css("left", getPosLeft(i,j));
                theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color",getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
    $(".number-cell").css("line-height",cellSideLength+"px");
    $(".number-cell").css("font-size",0.6 * cellSideLength+"px");

}

function generateOneNumeber(){
    if( nospace(board)){
        return false;
    }
    
    // 随机位置
    var randx =  parseInt(Math.floor(Math.random() * 4));
    var randy =  parseInt(Math.floor(Math.random() * 4));
    
    var times = 0;
    while( times < 50){
        if(board[randx][randy] == 0)
            break;
        
        randx =  parseInt(Math.floor(Math.random() * 4));
        randy =  parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if(times == 50){
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    // 随机数字
    var randNumber = Math.random() < 0.5 ? 2:4;

    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;

}

$(document).keydown(function(event){
    event.preventDefault();
    switch(event.keyCode) {
        case 37:
            if(moveLeft()){
                setTimeout("generateOneNumeber()",210);
                setTimeout("isGameover()",300);
            }
            break;
        case 38:
            if(moveUp()){
                setTimeout("generateOneNumeber()",210);
                setTimeout("isGameover()",300);
            }
            break;
        case 39:
            if(moveRight()){
                setTimeout("generateOneNumeber()",210);
                setTimeout("isGameover()",300);
            }
            
            break;
        case 40:
            if(moveDown()){
                setTimeout("generateOneNumeber()",210);
                setTimeout("isGameover()",300);
            }
            break;
        default:
            break;
    }

});


document.addEventListener("touchstart",function(event){
    
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener("touchmove",function(event){
    event.preventDefault();
},{passive:false});

document.addEventListener("touchend",function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
    //如果在棋盘格外触控,不进行滑动
    var containerY = $('#grid-container').offset().top;
    if(containerY >= starty)
         return true;
    
    if(Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth){
        return;
    }
    
    // x
    if (Math.abs(deltax) >= Math.abs(deltay)) {
        if(deltax > 0){
            // moveRight
            if(moveRight()){
                setTimeout("generateOneNumeber()", 210);
                setTimeout("isGameover()",300)
            }
        } else {
            // moveLeft
            if(moveLeft()){
                setTimeout("generateOneNumeber()",210);
                setTimeout("isGameover()",300)
            }
        }
    } 
    // y
    else {
        if (deltay > 0) {
            // moveDown
            if(moveDown()){
                setTimeout("generateOneNumeber()",210);
                setTimeout("isGameover()",300);
            }
        } else {
            // moveUp
            if(moveUp()){
                setTimeout("generateOneNumeber()",210);
                setTimeout("isGameover()",300);
            }
        }
    }
});

function isGameover(){
    if(nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    alert("Gameover!你的得分为"+score+"!");
}

function moveLeft(){
    
    // 判断是否能够向左移动
    if( !canMoveLeft(board)){
        return false;
    }

    // moveLeft
    for(var i = 0; i < 4; i++){
        for(var j = 1; j < 4; j++){
            if(board[i][j] != 0){
                
                for(var k = 0; k < j; k++){
                    if(board[i][k] == 0 && noBlockHorizonal(i, k, j, board)){
                        // move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k] == board[i][j] && noBlockHorizonal(i, k, j, board) && !hasConflicted[i][k]){
                        // move
                        showMoveAnimation(i,j,i,k)
                        // add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }

    for(var i = 0; i < 4; i++){
        for(var j = 2; j >=0; j--){
            if(board[i][j] != 0){

                for(var k = 3; k > j; k--){
                    if(board[i][k] == 0 && noBlockHorizonal(i, j, k, board)){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k] == board[i][j] && noBlockHorizonal(i, j, k, board) && !hasConflicted[i][k]){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }

    for(var i = 1; i < 4; i++){
        for(var j = 0; j < 4; j++){
            if(board[i][j] != 0){

                for(var k = 0; k < i; k++){
                    if(board[k][j] == 0 && noBlockVertical(k, i, j, board) ){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if(board[k][j] == board[i][j] && noBlockVertical(k, i, j, board)&& !hasConflicted[k][j]){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }

    for(var i = 2; i >= 0; i--){
        for(var j = 0; j < 4; j++){
            if(board[i][j] != 0){

                for(var k = 3; k > i; k--){
                    if(board[k][j] == 0 && noBlockVertical(i, k, j, board)){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if(board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

