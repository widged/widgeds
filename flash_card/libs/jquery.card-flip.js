/*
 CardFlip - Fridge CardFlip with jQuery
 http://github.com/widged/widgeds

 Created: Marielle Lange, 2011
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the jQuery library
   http://jquery.com
*/

(function($) {

    /**
     * Creates an activity
     *
     * @example $(".wg-qa").wgCardFlip();
     * @before <div class="wg-qa"/>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgCardFlip = function(o) { 
       return this.each(function() {
           $(this).data('wg', new $.wg(this, o));
        });
    };

    var version = '0.0.1';

    // Default configuration properties.
    var defaults = {
 		width: 210,
      height: 120,
      questionCardColor: '#F9F9F9',
      answerCardColor: '#999'
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
    $.wg = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});
        this.container   = $(e);
        this.setup();
    };
    
    $.wg.fn = $.wg.prototype = {
        version: this.version
    };

    $.wg.fn.extend = $.wg.extend = $.extend;

    $.wg.extend({
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

    // ##############################################
    //      End of plugin logic >>>
    // ##############################################

    $.wg.fn.extend({
        /**
         * Setups the widged.
         *
         * @return undefined
         */
         setup: function() {
            
            this.container.css({'width':this.options.width,'height':this.options.height,'margin':'4px','position':'relative','cursor':'pointer'});

            var wg = this;
            var text = this.container.html();
            var arr = text.split("|");
            var question = arr[0];
            var answer = arr[1];
            wg.clickToFlip = '<div style="position:absolute;bottom: 0px;width:100%;font-size:0.7em;text-align:center">click to flip</div>';

            var boxEl = $('<div/>');
            boxEl.css({'position':'absolute','left':'0','top':'0','width':'100%','height':'100%','border':'1px solid #ddd','background':' no-repeat center center ' + this.options.questionCardColor});
            var htmlEl = $('<p style="padding: 10px 20px;">' + question + '</p>');
            boxEl.append(htmlEl);
            boxEl.append(wg.clickToFlip)
         	
         	this.container.html('');
            this.container.append(boxEl);
            
            boxEl.bind("click",function(){
         		var elem = boxEl;
         		if(elem.data('flipped'))
         		{
         			elem.revertFlip();
         			elem.data('flipped',false)
         		}
         		else
         		{
         			elem.flip({
         				direction:'lr',
         				speed: 350,
         				color: wg.options.answerCardColor,
         				onBefore: function (){
         					elem.html('<p style="padding: 10px 20px;">' + answer + '</p>' + wg.clickToFlip);
         				}
         			});
         			elem.data('flipped',true);
         		}
            });
            
         }
 
    });


})(jQuery);