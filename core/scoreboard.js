(function(){
    var scoreboard = {

       boardEl: null,

       init: function () {
          $(document).bind("score.update", function(e, status){
             scoreboard.updateFeedback(status);
          });
       },
       
       hello: function(status) {
          alert('status:' + status.itemQty)          
       },
       
       updateFeedback: function(gameData) {
          var boardEl = gameData.board;
          console.log(boardEl);
          var msg = 'Matches: ' + gameData.answeredQty + "/" + gameData.itemQty;
          if(gameData.answeredQty == gameData.itemQty)
          {
             var s = Math.floor(gameData.timeElapsed / 1000);
       		// format time like hh:mm:ss
       		var h = parseInt(s / 3600), m = parseInt((s - h * 3600) / 60); s = s % 60;
       		var formatted = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
             msg += '&nbsp;&nbsp;&nbsp;Completion time: ' + formatted;
             
          }
          jQuery(boardEl).html(msg);
       }
       
       
    };
   
   $.extend(true, widged, {scoreboard: scoreboard});
})();