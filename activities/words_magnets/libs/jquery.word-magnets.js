/**
 * Word Magnets, Fridge Magnets with jQuery
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

    var version = '0.2';

    // Default configuration properties.
    var defaults = {
      parser: {uid: "words"},
 		width: 600,
      height: 400
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

            if(!this.options.list) { return; }
            var list = this.options.list;
            // Build the html
            var html = '';
            var el;
            this.container.html('');
            this.container.css({'border':'1px solid black', 'width': this.options.width + 'px', 'height':this.options.height+'px', 'position':'relative'});
            for(var i in list)
            {
               var item = list[i];
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
            
         }
 
    });


})(jQuery);