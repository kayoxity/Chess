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
  $(this).css('background-image','url(images/'+player+piece+'.png')
})


})