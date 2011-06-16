/*
 Scoreboard for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/

;(function($){
    var plugin = {
       hookMap: {},

       hook: function (boardSel, widgedSel) {
          var $activity = $(widgedSel);
          if(!plugin.hookMap[$activity]) { plugin.hookMap[$activity] = []; }
          plugin.hookMap[$activity].push(boardSel); 

          $activity.bind("score.change", function(e, status){
             plugin.updateFeedback(e.target, status);
          });
       },
       
       updateFeedback: function(selector, params) {
          // when using this.hookMap, the object content is lost after the binding. 
          // coreboard.hookMap maintains the value over binding (static variable);
          var $wgEl = $(selector);
          var boardList = plugin.hookMap[$wgEl];
          for(var i = 0; i < boardList.length; i++) {
             var boardEl = $(boardList[i]);
             
             var msg = 'Answered: ' + params.answeredQty + "/" + params.answerQty;
             if(params.answeredQty == params.answerQty)
             {
                var s = Math.floor(params.timeElapsed / 1000);
          		// format time like hh:mm:ss
          		var h = parseInt(s / 3600, 10), m = parseInt((s - h * 3600) / 60, 10); s = s % 60;
          		var formatted = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
                msg += '&nbsp;&nbsp;&nbsp;Completion time: ' + formatted;

             }
             $(boardEl).html(msg);
          }
       }
    };

    if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {scoreboard: plugin});
})(jQuery);

