/**
 * Dialog formatting, a widged plugin
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
     * @example $(".wg-dialog").wgDialog();
     * @before <div class="wg-dialog"><p class="talkerA"/><p class="talkerC"><p class="talkerD"></div>
     * @result  N/A
     * @return jQuery
     * @param o {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     */
    $.fn.wgDialog = function(o) {
         return this.each(function() {
            $(this).data('wgDialog', new $wg(this, o));
         });
    };

    var version = '0.2';

    // Default configuration properties.
    var defaults = {
       styles: [
          {
             icon: 'pix/F03.png',
             backgroundColor: '#FFF4BF',
             borderColor: '#FFDD73'
          },
          {
             icon: 'pix/FG04.png',
             backgroundColor: '#CEF',
             borderColor: '#008FCC',
          }
       ]
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
            this.render();
         },
         
         render: function() {
         
            sentences = [];

            var avatarList = [];
            var avatarId = 0;
            this.container.children('p').each(function(i) {
               avatarId = avatarList.indexOf(this.className);
               if(avatarId == -1) {avatarId = avatarList.length; avatarList.push(this.className); }
               sentences.push({id: avatarId, html: $(this).html()});
            });

            var avatarStyles = [];
            var avatarName, avatarStyle;
            for(i in avatarList)
            {
               avatarName = avatarList[i];
               avatarStyle = this.options.avatars[avatarName];
               avatarStyles[i] = $.extend(this.options.styles[i], avatarStyle);
            }
            
            var html = $('<div/>');
            for(i in sentences)
            {
               html.append(this.sentenceBox(sentences[i], avatarStyles[sentences[i].id]));
            }
            this.container.html(html);
         },
         
         sentenceBox: function(object, style) {
           // game parameters
           var box = $('<div/>');

           var iconBox = $('<strong/>');
           var contentBox = $('<div/>'); contentBox.append(object.html);
           // defaults
           var icon = style.icon;
           box.css({'position':'relative','padding': '10px','margin': '16px','font-family': 'Verdana', 'font-size': '12pt', 'line-height': '2'})
           box.css('background-color',style.borderColor);

           iconBox.css({'position' : 'absolute','float': 'left', 'left' : '0px', 'top' : '0px', 'display': 'block','padding': '10px', 'background-color': '#FFDD73' });
           iconBox.append('<img src="' + style.icon + '" width="80" />');
           iconBox.css('background-color',style.borderColor);

           contentBox.css({'display': 'block', 'padding': '10px', 'margin-left': '100px','min-height' : '70px'  })
           contentBox.css('background-color',style.backgroundColor);

           box.append(iconBox);
           box.append(contentBox);
           return box;
        }
    });


})(jQuery);