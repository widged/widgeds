/*
 Note - Note formatting with jQuery
 http://github.com/widged/widgeds

 Created: Marielle Lange, 2010
 Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.

 Built on top of the jQuery library
   http://jquery.com
*/

(function($) {

    /**
     * Creates an activity
     *
     * @example $(".wg-note").wgNote();
     * @before <div class="wg-note information">This is an information</div>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgNote = function(o) {
         return this.each(function() {
            $(this).data('wgNote', new $wg(this, o));
         });
    };

    // Default configuration properties.
    var defaults = {
       styles: {
          defaultNote: {
             icon: 'etc/pix/pen.png',
             contentBackground: '#FFF4BF',
             iconBackground: '#FFDD73'
          },
          tip: {
             icon: 'etc/pix/lamp.png',
             contentBackground: '#FFF4BF',
             iconBackground: '#FFDD73',
          },
          information: {
             icon: 'etc/pix/note.png',
             contentBackground: '#CEF',
             iconBackground: '#9DF'
          },
          news: {
             icon: 'etc/pix/news.png',
             contentBackground: '#FFF4BF',
             iconBackground: '#FFDD73'
          },
          orientation: {
             icon: 'etc/pix/map.png',
             contentBackground: '#E6FFB3',
             iconBackground: '#C4E67F'
          },
          notification: {
             icon: 'etc/pix/alarm.png',
             contentBackground: '#FFDACC',
             iconBackground: '#FFB499'
          },
          warning: {
             icon: 'etc/pix/alert.png',
             contentBackground: '#FFD9DD',
             iconBackground: '#FFA6AE'
          }
       }
    };
    
    /**
     * The wgNote object.
     *
     * @constructor
     * @class wgNote
     * @param e {HTMLElement} The element to create the widged for.
     * @param o {Object} A set of key/value pairs to set as configuration properties.
     * @cat Plugins/wgNote
     */
    $.wgNote = function(e, o) {
        this.options    = $.extend({}, defaults, o || {});

        this.container  = $(e);
        this.setup();
    };
    
    

    // Create shortcut for internal use
    var $wg = $.wgNote;

    $wg.fn = $wg.prototype = {
        wgNote: '0.0.1'
    };

    $wg.fn.extend = $wg.extend = $.extend;

    $wg.fn.extend({
        /**
         * Setups the widged.
         *
         * @return undefined
         */
        setup: function() {

           // game parameters
           this.styleName = this.options.styleName;

           var divHTML = this.container.html();
           var iconBox = $('<strong/>');
           var contentBox = $('<div/>'); contentBox.append(divHTML);
           // defaults
           var icon = this.options.styles['defaultNote'].icon;
           iconBox.css({'position' : 'absolute','float': 'left', 'left' : '-6px', 'top' : '0px', 'display': 'block','padding': '10px', 'background-color': '#FFDD73' });
           contentBox.css({'margin-left': '8px', 'display': 'block', 'padding': '16px', 'padding-left': '50px', 'border-style' : 'solid', 'border-width' : '2px' ,'font-family': 'Verdana', 'font-size': '12pt', 'line-height': '2' })

           // styles
           var styleList = ['tip', 'warning', 'information', 'notification','orientation','news'];
           var hasStyle = false;
           var style;
           for (i in styleList)
           {
              var name = styleList[i];
              if(this.container.hasClass(name))
              {
                 hasStyle = true;
                 style = this.options.styles[name];
                 icon = style.icon;
                 iconBox.css('background-color', style.iconBackground);
                 contentBox.css('background-color', style.contentBackground);
                 contentBox.css('border-color', style.iconBackground);
              }
           }
           if(!hasStyle)
           {
              style = this.options.styles.defaultNote;
              iconBox.css('background-color', style.iconBackground);
              contentBox.css('background-color', style.contentBackground);
              contentBox.css('border-color', style.iconBackground);
              
           }

           iconBox.append('<img src="' + icon + '" />');
           var newHTML = $('<div style="margin-bottom: 10px;margin-top: 10px;position:relative;left: 10px;margin-right: 16px"/>');
           newHTML.append(iconBox);
           newHTML.append(contentBox);
           newHTML.append('<div style="clear:both"/>');
           this.container.html(newHTML);
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