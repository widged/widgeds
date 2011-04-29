/*
 Scoreboard for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/

(function(){
    var scoreboard = {
       hookMap: {},

       hook: function (boardSel, widgedSel) {
          var widgedEl = jQuery(widgedSel);
          if(!scoreboard.hookMap[widgedEl]) { scoreboard.hookMap[widgedEl] = [] }; 
          scoreboard.hookMap[widgedEl].push(boardSel); 

          widgedEl.bind("score.change", function(e, status){
             scoreboard.updateFeedback(e.target, status);
          });
       },
       
       updateFeedback: function(wgEl, params) {
          // when using this.hookMap, the object content is lost after the binding. 
          // coreboard.hookMap maintains the value over binding (static variable);
          var wgEl = jQuery(wgEl);
          var boardList = scoreboard.hookMap[wgEl];
          for(var i = 0; i < boardList.length; i++) {
             var boardEl = jQuery(boardList[i]);
             
             var msg = 'Answered: ' + params.answeredQty + "/" + params.answerQty;
             if(params.answeredQty == params.answerQty)
             {
                var s = Math.floor(params.timeElapsed / 1000);
          		// format time like hh:mm:ss
          		var h = parseInt(s / 3600), m = parseInt((s - h * 3600) / 60); s = s % 60;
          		var formatted = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
                msg += '&nbsp;&nbsp;&nbsp;Completion time: ' + formatted;

             }
             jQuery(boardEl).html(msg);
          };
       }
    };

    if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {scoreboard: scoreboard});
})();

