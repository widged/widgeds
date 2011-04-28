/*
 ContentSlider - ContentSlider with jQuery
 http://github.com/widged/widgeds

 Created: Marielle Lange, 2010
 Distributed under the MIT (http://www.opensource.org/licenses/mit-license.php)

 Built on top of the jQuery library
   http://jquery.com
*/

(function($) {

    /**
     * Creates an activity
     *
     * @example $(".wg-contentSlider").wgContentSlider();
     * @before <div class="wg-dialog"><p class="talkerA"/><p class="talkerC"><p class="talkerD"></div>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgContentSlider = function(o) {
         return this.each(function() {
            $(this).data('wgContentSlider', new $wg(this, o));
         });
    };

    // Default configuration properties.
    var defaults = {
       styles: [
          { icon: 'assets/pen.png' },
          { icon: 'assets/graph.png' },
          { icon: 'assets/help.png'}
       ]
    };
    
    /**
     * The wgContentSlider object.
     *
     * @constructor
     * @class wgContentSlider
     * @param e {HTMLElement} The element to create the widged for.
     * @param o {Object} A set of key/value pairs to set as configuration properties.
     * @cat Plugins/wgContentSlider
     */
    $.wgContentSlider = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});

        this.container  = $(e);
        this.setup();
    };
    

    // Create shortcut for internal use
    var $wg = $.wgContentSlider;

    $wg.fn = $wg.prototype = {
        wgContentSlider: '0.0.1'
    };

    $wg.fn.extend = $wg.extend = $.extend;

    $wg.fn.extend({
        /**
         * Setups the widged.
         *
         * @return undefined
         */
         setup: function() {
            panels = [];

            this.container.children('div').each(function(i) {
               if($(this).hasClass('panel')) { panels.push({html: $(this).html()}); };
            });
            
            var topBox = $('<div style="text-align:left;background-color:#efefef;border:1px solid #ccc; width:450px;-moz-border-radius:10px;-webkit-border-radius:10px;margin:0 auto;font-family:arial;"/>');
            var ulBox = $('<div style="margin:0;padding:15px 15px 0 15px;list-style:none;float:left;border-right:1px solid #dedede;height:285px;"/>');
            this.maskBox = $('<div class="mask" style="float:left;width:300px;height:280px;margin:15px 0 0 10px;overflow:hidden;"/>');
            var sliderBox = $('<div class="slider-body">');
            for(var i = 0; i < panels.length; i++)
            {
               var line = $('<div style="margin-bottom:16px;padding:5px;background-color:#F9F9F9;border:1px solid #ccc;-moz-border-radius:10px;-webkit-border-radius:10px;"><img src="' + this.options.styles[i].icon + '"></div>\n');
               line.bind( 
                 'click', // bind to multiple events 
                 { script: this, panelId: i }, // pass in data
                 function(eventObject) {  eventObject.data.script.onThumbClick(eventObject.data.panelId); }
               );                 

               ulBox.append(line);
               
               sliderBox.append('<div class="panel" id="panel-' + i + '" style="width:300px;height:280px;text-align:left;">' + panels[i].html + '</div>');
            }
            
            this.maskBox.append(sliderBox);
            topBox.append(ulBox);
            topBox.append(this.maskBox);
            topBox.append('<div style="clear:both"></div>');
            this.container.html(topBox);
         },
         
         onThumbClick: function(panelId) {
            this.maskBox.scrollTo('#panel-' + panelId, 300);
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