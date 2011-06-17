/*
 Scoreboard for widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the widged library
 http://github.com/widged/widgeds
*/

;(function($){
    var plugin = {

       update: function(selector, data) {
             var $boardEl = $(selector);
             var msg = 'Answered: ' + data.answeredQty + "/" + data.answerQty;
             if(data.answeredQty == data.answerQty)
             {
                var s = Math.floor(data.timeElapsed / 1000);
          		// format time like hh:mm:ss
          		var h = parseInt(s / 3600, 10), m = parseInt((s - h * 3600) / 60, 10); s = s % 60;
          		var formatted = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
                msg += '&nbsp;&nbsp;&nbsp;Completion time: ' + formatted;
             }
             $boardEl.html(msg);
       }
    };

    if(!window.widged){window.widged={};}//We create a shortcut for our framework, we can call the methods by $$.method();
   $.extend(true, window.widged, {scoreboard: plugin});
})(jQuery);

