/**
 * Student Scores, Scoreboard with jQuery
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
     * @example $(".wg-Magnets").wgStudentScores();
     * @before <div class="wg-StudentScores"/>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgStudentScores = function(o) {
         return this.each(function() {
            $(this).data('widged', new $wg(this, o));
         });
    };

    var version = '0.2';

    // Default configuration properties.
    var defaults = {
         scoreList     : null,
         legendWidth      : 60,                
         barWidth         : 120,               
         barHeight        : 12,                
         baseUrl          : '',
         progressBackground  : 'assets/progressbar.gif',      
         progressImages      : {
                        0:   'assets/progressbg_red.gif',
                        30: 'assets/progressbg_orange.gif',
                        50: 'assets/progressbg_yellow.gif',
                        70: 'assets/progressbg_green.gif'
                     },
       
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
            var wg = this;
            this.container.bind("dataChange", function(e, data){ wg.onDataChange(data); });
            this.render();
         },

         onDataChange: function(data) {
            $.extend(this.options, data || {})
            this.render();
         },

         render: function() {
            var html = '';
            var scoreList = this.options.scoreList;

            this.container.html('');
            var barWidth = this.options.barWidth;
            var barHeight = this.options.barHeight;
            var legendWidth = this.options.legendWidth;

            var progressMax = barWidth / 100;

            var percentValue, percentText, progressImages = this.options.progressImages, progressBackground = this.options.progressBackground, baseUrl = this.options.baseUrl;
            for (col in scoreList)
            {
               itemEl = $('<div class="score"><div style="width:' + legendWidth + 'px;display:inline-block">' + col + '</div></div>');
               percentValue = scoreList[col];
               percentText = percentValue + "%";
               
               for (var i in progressImages) {
                  if (percentValue >= parseInt(i)) {
                     progressImage = progressImages[i];
                  } else { break; }
               }
               
               var $bar      = $('<img/>');
               var $text      = $('<span style="padding-left: 20px"/>');

               $text.html(percentText);
               $bar.attr('title', 'barTitle');
               $bar.attr('alt', percentText);
               $bar.attr('width', barWidth);
               $bar.css({
                  'height': barHeight + "px",
                  'width': barWidth + "px",
                  'src': baseUrl + progressBackground,
                  'background-image': "url(" + baseUrl + progressImage + ")",
                  'background-position': (barWidth * -1) + (percentValue * progressMax ) + 'px 50%',
                  'padding' : 0,
                  'margin' : 0
               })

               itemEl.append($bar);
               itemEl.append($text);
               this.container.append(itemEl);
            }
         }
 
    });


})(jQuery);