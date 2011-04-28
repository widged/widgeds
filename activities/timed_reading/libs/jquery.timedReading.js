/**
 * Timed REading, a learning activity with jQuery
 * @version: 0.2 (2011/04/28)
 * @requires jQuery v1.4.2 or later 
 * @author Marielle Lange
 * Source: http://github.com/widged/widgeds
 *  
 * Built on top of the jQuery library
 *   http://jquery.com
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
 (function($) {

    /**
     * Creates an activity
     *
     * @example $(".wg-timedReading").wgTimedReading();
     * @before <ul id="myactivity" class="wgTimedReading-skin-name"><li>First item</li><li>Second item</li></ul>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgTimedReading = function(o) {
         return this.each(function() {
            $(this).data('wgTimedReading', new $wg(this, o));
         });
    };

    var version = '0.2';

    // Default configuration properties.
    var defaults = {
       timeLimit: 10000
    };

    // ##############################################
    // <<<  Plugin logic, shared by all widgets
    //      (no modifications required, leave on top)
    // ##############################################
    /**
     * The widged object.
     *
     * @constructor
     * @class widged
     * @param e {HTMLElement} The element to create the widged for.
     * @param o {Object} A set of key/value pairs to set as configuration properties.
     * @cat Plugins/widged
     */
    $wg = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});
        this.container   = $(e);
        this.setup();
    };

    $wg.fn = $wg.prototype = {
        version: this.version
    };

    $wg.fn.extend = $wg.extend = $.extend;

    // ##############################################
    //      End of plugin logic >>>
    // ##############################################

    $wg.fn.extend({
        /**
         * Setups the widged.
         *
         * @return undefined
         */
        setup: function() {

           // game parameters
           var divHTML = this.container.html();
           this.controlBox = $('<div style="margin-bottom:40px;text-align:center;"/>');
           
           var titleBox = this.container.find('.title');
           titleBox.css({'font-weight': 'bold', 'text-align' : 'center'})
           this.contentBox = this.container.find('.content');

           var activityBox = $('<div style="border-color:#E69D00;border-style:solid;border-width:1px;background-color:#FFF4BF;padding:20px;font-family:Geneva,Arial" />');
           
           activityBox.append(this.controlBox);
           activityBox.append(titleBox);
           activityBox.append(this.contentBox);
           this.container.html(activityBox);

           this.tickInterval = 1000; // in milliseconds
           this.maxTime = this.options.timeLimit; // in milliseconds, 5 minutes = 300000 ms

           this.updateActivity('init');
        },
        

        // ################
        // Interactivity
        // ################
        
        onTimerTick: function(tickCount) {
           this.updateActivity(tickCount);
        },

        onStartClick: function() {
           this.updateActivity('start');
        },
        
        // ################
        // View
        // ################
        updateActivity: function(value) {

           var el;
           var timeElapsed;
           switch(value)
           {
              case 'init':
              case 'startAgain':
                  var buttonText, feedback;
                  if(value == 'startAgain') { 
                     buttonText = 'Start Reading Again' ;
                     feedback = '<div>Your time is over!</div>';
                  } else { 
                     buttonText = 'Start Reading';
                     feedback = '';
                  }
                  el = $('<div style="font-size:11px"><input type="submit" value="' + buttonText + '" style="border-color:#E69D00;border-width:1px;background-color:#FFDD73;padding:8px;"/>' + feedback + '</div>');
                  el.bind( 
                    'click', // bind to multiple events 
                    { script: this }, // pass in data
                    function(eventObject) {  eventObject.data.script.onStartClick(); }
                  );                 
                  this.contentBox.hide();
              break;

              case 'start':
                  this.timeBox = $('<input id="timeInput" type="input" value="' + '' + '" size="10"/>');
                  el = $('<div style="font-size:10px:margin-top:11px">Remaining Time: </div>');
                  el.append(this.timeBox);
                  timeElapsed = this.tickToTime(0)
                  this.timeBox.val(this.timeAsText(timeElapsed));
                  this.contentBox.show();
                  $(this).stopTime();
                  $(this).everyTime(this.tickInterval, function(i) {
                    this.onTimerTick(i);
                  }, 0);   
               break;
              default:
                  timeElapsed = this.tickToTime(value);
                  if(timeElapsed <= 0) { 
                     this.updateActivity('startAgain') 
                  } 
                  else
                  {
                     this.timeBox.val(this.timeAsText(timeElapsed));
                  }
              break;
           }

           this.controlBox.html(el);
        },
        
        // ################
        // Utilities
        // ################
        tickToTime: function(value) {
           var d;
           if(value == 0) {
              d = new Date(this.maxTime); 
            } else { 
               var timeElapsed = this.maxTime - (value * this.tickInterval);
              d= new Date(timeElapsed);
            }
            return d;
        },        

        timeAsText: function(d) {
            var seconds = d.getSeconds();
            if (seconds < 10){
               seconds = "0" + seconds
            }
           return d.getMinutes() + ":" + seconds;
        }        

    });

    $wg.extend({
        /**
         * Gets/Sets the global default configuration properties.
         *
         * @return {Object}
         * @param d {Object} A set of key/value pairs to set as configuration properties.
         */
        defaults: function(d) {
            return $.extend(defaults, d || {});
        }
   
    });

})(jQuery);