/**
 * Tooltips, minimalist tooltip popups in jQuery
 * @version: 0.1 (2011/05/23)
 * @requires jQuery v1.4.2 or later 
 * @author Marielle Lange
 * Source: http://github.com/widged/widgeds
 *  
 * Derived from
 *   http://net.tutsplus.com/tutorials/javascript-ajax/build-a-better-tooltip-with-jquery-awesomeness/
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
    $.fn.wgTooltip = function(o) {
        addTipToPage();
         return this.each(function() {
            $(this).data('widged', new $wg(this, o));
         });
    };
    

    // Default configuration properties.
    var defaults = {
 		speed: 200,
 		delay: 300,
 		linkColor: "#C3C3C3"
    };

    function addTipToPage() {
         var $tipPopup = $(
         	"<div class='tipPopup'>" +
         		"<div class='tipMid' style='background: transparent url(assets/tipMid.png) repeat-y; padding: 0 25px 20px 25px;'>"	+
         		"</div>" +
         		"<div class='tipBtm' style='background: transparent url(assets/tipBtm.png) no-repeat bottom; height: 32px;'>"	+
         	"</div>"
         );
         $tipPopup.css({
            'color': '#333',
         	'width': '212px',
         	'padding-top': '37px',
         	'overflow': 'hidden',
         	'display': 'none',
         	'position': 'absolute',
         	'z-index': 500,
         	'background': 'transparent url(assets/tipTop.png) no-repeat top'
         });
         $("body").prepend($tipPopup);
    }

    var version = '0.2';

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
            // Build the html
            var list = this.options.list;
      		var tip = $('.tipPopup');
      		var tipInner = $('.tipPopup .tipMid');
      		var offset, tWidth, tHeight, tLeft, tTop;
      		var tTitle = "";
      		var tipDelay = this.options.delay;
      		var tipSpeed = this.options.speed;


            $html = $("<div/>");
            for(i  in list)
            {
               var item = list[i];
               // items
               $html.append(item.html);
               if(!item.options || !item.options.length ) {continue; }
               var tipText =  item.options[0].html.split("=");
               tTitle = tipText[1];
               $el = $('<span class="tTip" title="' +  tTitle + '">' +  tipText[0] + '</span>');
         		$el.css('color', this.options.linkColor);
               $html.append($el);

         		offset = $el.offset();
         		tWidth = $el.width();
         		tHeight = $el.height();
         		tLeft = offset.left;
         		tTop  = offset.top;
         		

         		/* Mouse over and out functions*/
         		$el.hover(
         			function() {
         				tipInner.html(this.title);
         				setTip($(this).offset().top, $(this).offset().left);
         				setTimer();
         			}, 
         			function() {
         				stopTimer();
         				tip.hide();
         			}
         		);		   
            }
            this.container.html('');
            this.container.append($html);

      		/* Delay the fade-in animation of the tooltip */
      		setTimer = function() {
      			$el.showTipTimer = setInterval("showTip()", tipDelay);
      		}

      		stopTimer = function() {
      			clearInterval($el.showTipTimer);
      		}

      		/* Position the tooltip relative to the class 
      		   associated with the tooltip                */
      		setTip = function(top, left){
      			var topOffset = tip.height();
      			var xTip = (left-50)+"px";
      			var yTip = (top-topOffset-60)+"px";
      			tip.css({'top' : yTip, 'left' : xTip});
      		}

      		/* This function stops the timer and creates the
      		   fade-in animation                          */
      		showTip = function(){
      			stopTimer();
      			tip.animate({"top": "+=20px", "opacity": "toggle"}, tipSpeed);
      		}
            
         },
         
 
 
    });


})(jQuery);