/*
 Magnets - Fridge Magnets with jQuery
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
     * @example $(".wg-Magnets").wgMagnets();
     * @before <div class="wg-Magnets"/>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgMagnets = function(o) {
         return this.each(function() {
            $(this).data('widged', new $wg(this, o));
         });
    };

    // Default configuration properties.
    var defaults = {
 		width: 600,
      height: 400
    };
    
    /**
     * The widged object.
     *
     * @constructor
     * @class widged
     * @param e {HTMLElement} The element to create the widged for.
     * @param o {Object} A set of key/value pairs to set as configuration properties.
     * @cat Plugins/widged
     */
    $.widged = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});
        this.container   = $(e);
        this.setup();
    };
    

    // Create shortcut for internal use
    var $wg = $.widged;

    $wg.fn = $wg.prototype = {
        version: '0.0.1'
    };

    $wg.fn.extend = $wg.extend = $.extend;

    $wg.fn.extend({
        /**
         * Setups the widged.
         *
         * @return undefined
         */
         setup: function() {

            // parse items in the activity division
            this.itemList = this.parseWords();

            // Build the html
            var html = '';
            var el;
            this.container.html('');
            this.container.css({'border':'1px solid black', 'width': this.options.width + 'px', 'height':this.options.height+'px', 'position':'relative'});
            for(var i in this.itemList)
            {
               var item = this.itemList[i];
               // items
               itemEl = $('<div class="magnet" style="left: 10px; top: 10px;">' + item.html + '</div>');
               itemEl.css({'border': '1px solid black', 'border-right': '2px solid black', 'border-bottom': '2px solid black', 'font-family': '"courier new",veranda,arial', 'float': 'left', 'padding': '0 3px 0 3px', 'background': 'white', 'cursor': 'pointer', 'position': 'absolute'});
               itemEl.css({'left': Math.round(Math.random() * (this.options.width-100)) + 20 + 'px'});
               itemEl.css({'top': Math.round(Math.random() * (this.options.height - 100)) + 20 + 'px'});
               itemEl.draggable({
                       containment: 'parent',
                       stack:'.item',
                       });
               item.el = el;
               itemEl.append(el);
               this.container.append(itemEl);
            }
            
         },

         // ################
         // Itemps Parsers
         // ################
         
         parseWords: function(str) {
            var text = this.container.html();
            var arr = text.split(/[ \t\n]+/);
            var list = [], item = '';
            for(var i = 0; i < arr.length; i++)
            {
               item = arr[i];
               if(item == undefined || !item.length) { continue; }
               list.push({html: item});
            }
            return list;
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