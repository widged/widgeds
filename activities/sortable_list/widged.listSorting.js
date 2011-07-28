/**
 * Racing Game, a learning activity with jQuery
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
     * @example $(".wg-racingCar").wgListSorting();
     * @before <div class="wg-racingCar"/>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgListSorting = function(o) {
         return this.each(function() {
            $(this).data('wg', new $wg(this, o));
         });
    };

    var version = '0.2';

    // Default configuration properties.
    var defaults = {
 		dragImageCSS: 
 		{
             'background-image': 'url("http://widged.com/widgeds/v2/third_party/222222_256x240_icons_icons.png")',
             'background-position': '-128px -48px',
             'color': '#FFF7C2',
             'margin-top': '2px',
             'width': '16px', 
             'height': '16px' 
        }
 		
 		
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
            
            var $el = $(this.container);

             $el.sortable();
             $el.disableSelection();
             $el.css({
                    'list-style-type': 'none',
                   'margin': 0, 'padding': 0,
                  'width': '60%'
              });
              $el.find("li" ).css({
                   'margin': '0 3px 3px 3px', 
                   'padding': '0.4em',
                   'padding-left': '1.5em',
                   'font-size': '1.4em',
                   'min-height': '18px',
                   'border': '1px solid #FFE180',
                   'background-color': '#FFF7C2'

              });
              $el.find("li>span" ).css({
                   'position': 'absolute',
                   'margin-left': '-1.3em'
              });
              $el.find("li>span.icon-arrow" ).css(this.options.dragImageCSS);
         },

         render: function() {}

 
    });


})(jQuery);