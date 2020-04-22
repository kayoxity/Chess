$(document).ready(function(){

var selection = {piece:'',player:'',row:'',column:''}
playerturn = 'white'

$("[piece]").each(function(){
  let player = $(this).attr('player'),
  piece = $(this).attr('piece'),
  boardsquarecolour = $(this).css('background-color')
  if(piece == ''){
    $(this).attr('empty',true)
    $(this).removeAttr('player').removeAttr('piece')
    return
  }
  $(this).attr('empty','false')
  $(this).css('background-image','url(images/'+player+piece+'.png)')
})


$("[empty]").on('click',function(){
  var empty = $(this).attr('empty'),
  targetpiece = $(this).attr('piece'),
  targetplayer = $(this).attr('player'),
  targetrow = $(this).attr('row'),
  targetcolumn = $(this).attr('column');
  if(targetplayer == playerturn){
    $("[empty='false']").each(function() { 
       if($(this).hasClass('grey')){
         var bgcolor = 'grey'
       }
       else{
         var bgcolor = 'white'
       }
       $(this).css('background-color',bgcolor)
      //  console.log("Here");
      })
      $(this).css('background-color','green')
      selection = {piece:targetpiece,player:targetplayer,row:targetrow,column:targetcolumn}
  }
  else if(selection.piece != '' && selection.player != '' && selection.player == playerturn &&
          (targetrow != selection.row || targetcolumn != selection.column)){
      if(typeof targetpiece == 'undefined'){
        targetpiece = ''
      }
      if(typeof targetplayer == 'undefined'){
        targetplayer = ''
      }

      correctmove(selection.player, selection.piece, selection.row, selection.column, targetrow, targetcolumn,
        targetpiece, targetplayer)
  }
  else{
    console.log('no piece or not correct turn')
  }
  });

function correctmove(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer){
  var canmove = false;
  row = parseInt(row);
  column = parseInt(column);
  targetcolumn = parseInt(targetcolumn);
  targetrow = parseInt(targetrow);
  var moverow,firstmoverow;

  if(piece == 'pawn'){
    if(player == 'white'){
      moverow = row + 1;
      if(row == 2){
        firstmoverow = row + 2;
      }
    }
    else if(player == 'black'){
      moverow = row - 1;
      if(row == 7){
        firstmoverow = row - 2;
      }
    }
    
    if((targetrow == moverow || targetrow == firstmoverow) && ((targetpiece == '' && targetcolumn == column) || 
      (targetpiece != '' && targetplayer != player && (targetcolumn == column+1 || targetcolumn == column - 1)))){
        canmove = true;
      }
  }
  if(piece == 'rook'){
    canmove = straightlinecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer);
  }
  if(piece == 'knight'){
    canmove = knightmovecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer);
  }
  if(piece == 'bishop'){
    canmove = diagonallinecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer);
  }
  if(piece == 'queen'){
    canmove = (straightlinecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer) ||
    diagonallinecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer));
  }
  if(piece == 'king'){
    canmove = kingmovecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer)
  }

  if(canmove == true){
    $("[row='"+targetrow+"'][column='"+targetcolumn+"']").css('background-image', 'url(images/'+player+piece+'.png)').attr('piece', piece).attr('empty','false').attr('player',player);
    if($("[row='"+row+"'][column='"+column+"']").hasClass('white')){
      bgcolor = 'white'
    }
    else{
      bgcolor = 'grey'
    }
    $("[row='"+row+"'][column='"+column+"']").css('background-image', 'none').attr('piece','').attr('empty','true').attr('player','').css('background-color',bgcolor);
    if(playerturn == 'white'){
      $("#turn").css('background-color','black').css('color','white');
      playerturn = 'black'
      $("#turn").html("It\'s Black\'s Turn");
    }
    else{
      $("#turn").css('background-color','white').css('color','black');
      $("#turn").html("It\'s White\'s Turn");
      playerturn = 'white'
    }
  }
}

function kingmovecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer){
  canmove = false
  if((targetcolumn == column + 1 && targetrow == row + 1) || (targetcolumn == column + 1 && targetrow == row - 1) || 
    (targetcolumn == column - 1 && targetrow == row + 1) || (targetcolumn == column - 1 && targetrow == row - 1) ||
    (targetcolumn == column + 1 && targetrow == row) || (targetcolumn == column - 1 && targetrow == row) ||
    (targetcolumn == column && targetrow == row + 1) || (targetcolumn == column && targetrow == row - 1) ){
      canmove = true;
    }
  return canmove
}

function knightmovecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer){
  console.log("here knight")
  var canmove = false;
  if(row + 2 == targetrow && (column + 1 == targetcolumn || column - 1 == targetcolumn) && targetpiece != playerturn){
    canmove = true;
  }
  if(row - 2 == targetrow && (column + 1 == targetcolumn || column - 1 == targetcolumn) && targetpiece != playerturn){
    canmove = true;
  }
  if(column - 2 == targetcolumn && (row + 1 == targetrow || row - 1 == targetrow) && targetpiece != playerturn){
    canmove = true;
  }
  if(column + 2 == targetcolumn && (row + 1 == targetrow || row - 1 == targetrow) && targetpiece != playerturn){
    canmove = true;
  }
  return canmove;
}

function diagonallinecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer){
  let canmove = true;
  var loops = Math.abs(targetcolumn - column);
  if(Math.abs(targetrow-row) == loops){
    for(var i = 1;i < loops;i++){
      if(targetrow > row){
        looprow = row + i;
      }
      else{
        looprow = row - i;
      }
      if(targetcolumn > column)
      {
        loopcolumn = column + i;
      }
      else
      {
        loopcolumn = column - i;
      }
      if($("[row='"+looprow+"'][column='"+loopcolumn+"']").attr('empty') == 'true'){
        continue;
      }
      else if($("[row='"+looprow+"'][column='"+loopcolumn+"']").attr('player') !== playerturn && 
              i == loops){
                continue;
      }
      else{
        canmove = false;
        break;
      }
    }
  }
  else{
    canmove = false;
  }
  console.log(canmove);
  return canmove;

}

function straightlinecheck(player, piece, row, column, targetrow, targetcolumn, targetpiece, targetplayer){
  var canmove = true;
  if(targetrow == row){
    if(targetcolumn == column){
      return false;
    }
    else if(targetcolumn > column){
      loops = targetcolumn-column;
    }
    else{
      loops = column-targetcolumn;
    }
    for(var i = 1;i <= loops;i++){
      if(targetcolumn > column){
        looptargetcolumn = column + i;
      }
      else{
        looptargetcolumn = column - i;
      }
      if($("[row='"+targetrow+"'][column='"+looptargetcolumn+"']").attr('empty') == 'true'){
        continue;
      }
      else{
        console.log("straight")
        canmove = false;
        break;
      }
    }
  }
  else if(targetcolumn == column){
    if(row == targetrow){
      return false;
    }
    else if(row > targetrow){
      loops = row - targetrow;
    }
    else{
      loops = targetrow - row;
    }
    for(var i = 1;i <= loops;i++){
      
      if(row > targetrow){
        looptargetrow = row - i;
      }
      else{
        looptargetrow = row + i;
      }
      console.log(looptargetrow)
      if($("[row='"+looptargetrow+"'][column='"+targetcolumn+"']").attr('empty') == 'true'){
        continue;
      }
      else{
        console.log("straight2")
        canmove = false;
        break;
      }
    }
  }
  if(row != targetrow && column != targetcolumn){
    canmove = false;
  }
  return canmove;
}

})
